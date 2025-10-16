import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PopularityModule } from 'src/popularity/popularity.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PopularityModule],
})
export class OrderModule {}
