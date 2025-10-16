import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

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
  controllers: [ReviewsController],
  providers: [ReviewsService, FileService],
})
export class ReviewsModule {}
