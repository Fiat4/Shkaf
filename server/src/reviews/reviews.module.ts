import { BadRequestException, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { FileService } from 'src/files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PopularityModule } from 'src/popularity/popularity.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 12,
      },
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
    PopularityModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, FileService],
})
export class ReviewsModule {}
