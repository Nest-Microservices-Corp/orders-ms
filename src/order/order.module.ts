import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { NatsModule } from '../transport/nats.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    NatsModule
  ]
})
export class OrderModule {}
