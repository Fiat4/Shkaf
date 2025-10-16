import { Module } from '@nestjs/common';
import { PopularityService } from './popularity.service';
import { PopularityController } from './popularity.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PopularityController],
  providers: [PopularityService, PrismaService],
  exports: [PopularityService],
})
export class PopularityModule {}
