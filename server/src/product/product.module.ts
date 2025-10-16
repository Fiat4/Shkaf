import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { v4 } from 'uuid';
import * as path from 'path';
import { FileService } from 'src/files/files.service';
import { PopularityModule } from 'src/popularity/popularity.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|webp|x-png)$/)) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                'Для загрузки доступны только изображения',
              ),
              false,
            );
          }
        },
      }),
      inject: [ConfigService],
    }),
    PopularityModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, FileService],
})
export class ProductModule {}
