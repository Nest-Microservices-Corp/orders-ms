import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderPagerDto, CreateOrderDto, ChangeStatusOrderDto } from './dto';

@Controller()
export class OrderController {

  constructor(
    private readonly _orderService: OrderService,
  ) {}

  @MessagePattern('createOrder')
  create( @Payload() createOrderDto: CreateOrderDto ) {
    return this._orderService.create(createOrderDto);
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
}
