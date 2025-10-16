import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UploadedReviewFilesDto {
  @IsOptional()
  @IsArray({ message: 'Изображения должны быть массивом файлов' })
  // @ArrayMinSize(2, { message: 'Необходимо загрузить хотя бы 2 изображения' })
  @ArrayMaxSize(5, { message: 'Можно загрузить до 5 изображений' })
  imgs!: Express.Multer.File[];

  @IsOptional()
  @IsArray({ message: 'Аватар должен быть массивом файлов' })
  @ArrayMaxSize(1, { message: 'Можно загрузить только 1 аватар' })
  avatar!: Express.Multer.File[];
}
