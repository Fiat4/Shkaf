import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
