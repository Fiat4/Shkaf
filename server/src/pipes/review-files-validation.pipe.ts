import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UploadedReviewFilesDto } from 'src/reviews/dto/upload-review-files.dto';

@Injectable()
export class UploadedReviewFilesValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File[], metadata: ArgumentMetadata) {
    // if (!value || value.length === 0) {
    //   throw new BadRequestException('Изображения для отзыва обязательны.');
    // }

    const object = plainToInstance(UploadedReviewFilesDto, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((err) => {
          return Object.values(err.constraints || {}).join(', ');
        })
        .join('; ');
      throw new BadRequestException(`Ошибка валидации файлов: ${messages}`);
    }
    return value; 
  }
}
