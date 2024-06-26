import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChangeStatusOrderDto, CreateOrderDto, OrderPagerDto } from './dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService extends PrismaClient implements OnModuleInit {
  
  private readonly _logger = new Logger('OrdersService');

  constructor(
    @Inject( NATS_SERVICE )
    private readonly _client: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();

    this._logger.log('Database Connected !!!');
  }
  

  async create( createOrderDto: CreateOrderDto ) {
    
    try {

      const { items } = createOrderDto;

      const ids = items.map( (i) => i.productId );
    
      const products: any[] = await firstValueFrom(
        this._client.send( { cmd: 'validate_product' }, {ids} )
      );
  
      let totals = items.reduce( (acc, oItem) => {
        const price = products.find( (p) => p.id == oItem.productId ).price;
        
        acc.amount += price * oItem.quantity;
        acc.quantity += oItem.quantity;

        return acc;
      }, { amount: 0, quantity: 0 } );

     const newOrder = await this.order.create({
      data: {
        totalAmount: totals.amount,
        totalItems: totals.quantity,
        OrderItem: {
          createMany: {
            data: items.map( (oItem) => ({
              price: products.find( (p) => p.id == oItem.productId ).price,
              productId: oItem.productId,
              quantity: oItem.quantity
            }) )
          }
        }
      },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true
          }
        }
      }
     })

      return {
        ...newOrder,
        OrderItem: newOrder.OrderItem.map( ( oItem ) => ({
          ...oItem,
          name: products.find( (p) => p.id === oItem.productId ).name
        }) )
      };
      
    } catch (error) {
      this._logger.error( error.message );
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Error interno al crear orden ` + error?.message
      });
    }
    
  }

  async findAll( pagerDto: OrderPagerDto ) {
    
    try {
      
      let { page = 0, limit = 10, filter = '', status } = pagerDto;

      let skip = ( page - 1 ) * limit;
  
      let where: Prisma.OrderWhereInput = {};
  
      if( status ) {
        where.status = status;
      }
  
      if( page == 0 ) {
        skip = 0;
        limit = 100;
      }
  
      const [ data, total ] = await Promise.all([
  
        this.order.findMany({
          where,
          skip,
          take: limit
        }),
        this.order.count({ where })
  
      ]);
      
      return { data, total };

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Error interno al listar ordenes ` 
      });
    }

  }

  async findOne( id: string ) {
    
    try {
      
      const orderFinded = await this.order.findUnique({
        where: { id },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true
            }
          }
        }
      });

      if( !orderFinded ) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Order by id: ${id}, not found`
        });
      }

      const { OrderItem, ...order } = orderFinded;

      const ids = OrderItem.map( (oItem) => oItem.productId );

      const products: any[] = await firstValueFrom(
        this._client.send( { cmd: 'validate_product' }, {ids} )
      );
      
      return {
        ...order,
        OrderItem: OrderItem.map( (oItem) => ({
          ...oItem,
          name: products.find( (p) => p.id === oItem.productId )?.name ?? ''
        }) )
      };
      
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Error interno al listar orden por id ` + error?.message
      })
    }

  }

  changeStatus( changeStatusDto: ChangeStatusOrderDto ) {
    
    try {

      const { id, status } = changeStatusDto;
      
      const order = this.order.update({
        data: {
          status
        },
        where: { id }
      });
      
      return order;

    } catch (error) {
      throw new RpcException({
        status: 500,
        message: `Error interno al listar orden por id ` + error?.message
      })
    }

  }
}
