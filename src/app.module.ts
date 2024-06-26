import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { NatsModule } from './transport/nats.module';

@Module({
  imports: [OrderModule, NatsModule],
  controllers: [],
  providers: [],

})
export class AppModule {}
