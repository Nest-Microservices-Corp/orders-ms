import { Controller, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderPagerDto, CreateOrderDto, ChangeStatusOrderDto, PaymentOrderDto } from './dto';
import { NATS_SERVICE } from '../config';

@Controller()
export class OrderController {

  constructor(
    private readonly _orderService: OrderService,
    @Inject( NATS_SERVICE )
    private readonly _client: ClientProxy
  ) {}

  @MessagePattern('createOrder')
  async create( @Payload() createOrderDto: CreateOrderDto ) {
    const order = await this._orderService.create(createOrderDto);
    const payment = await this._orderService.paymentIntent( order );

    return {
      order,
      payment
    }
  }

  @MessagePattern('findAllOrder')
  findAll( @Payload() pagerDto: OrderPagerDto ) {
    return this._orderService.findAll( pagerDto );
  }

  @MessagePattern('findOneOrder')
  findOne( @Payload( 'id', ParseUUIDPipe ) id: string) {
    return this._orderService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  chnageOrderStatus( @Payload() changeStatusDto: ChangeStatusOrderDto ) {
    return this._orderService.changeStatus( changeStatusDto );
  }

  @EventPattern('payment.succeeded')
  oderPayment( @Payload() payload: PaymentOrderDto ) {
    return this._orderService.paymentOrder( payload );
  }
}
