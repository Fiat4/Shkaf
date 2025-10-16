import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PopularityModule } from './popularity/popularity.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    PrismaModule,
    ProductModule,
    OrderModule,
    ReviewsModule,
    PopularityModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
