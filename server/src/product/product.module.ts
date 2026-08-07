import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileService } from 'src/files/files.service';
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
  controllers: [ProductController],
  providers: [ProductService, FileService],
})
export class ProductModule {}
