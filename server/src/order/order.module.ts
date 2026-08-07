import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PopularityModule } from 'src/popularity/popularity.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PopularityModule, TelegramModule],
  exports: [OrderService],
})
export class OrderModule {}
