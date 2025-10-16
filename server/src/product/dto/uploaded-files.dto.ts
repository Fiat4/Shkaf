import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';

export class UploadedCreateFilesDto {
  @IsArray({ message: 'Аватар должен быть массивом файлов' })
  @ArrayMinSize(1, { message: 'Необходимо загрузить хотя бы 1 аватар' })
  @ArrayMaxSize(1, { message: 'Можно загрузить только 1 аватар' })
  avatar: Express.Multer.File[];

  @IsArray({ message: 'Изображения должны быть массивом файлов' })
  @ArrayMinSize(2, { message: 'Необходимо загрузить хотя бы 2 изображения' })
  @ArrayMaxSize(6, { message: 'Можно загрузить до 6 изображений' })
  imgs: Express.Multer.File[];
}

export class UploadedUpdateFilesDto {
  @IsOptional()
  @IsArray({ message: 'Аватар должен быть массивом файлов' })
  @ArrayMaxSize(1, { message: 'Можно загрузить только 1 аватар' })
  avatar?: Express.Multer.File[];

  @IsOptional()
  @IsArray({ message: 'Изображения должны быть массивом файлов' })
  @ArrayMinSize(2, { message: 'Необходимо загрузить хотя бы 2 изображения' })
  @ArrayMaxSize(6, { message: 'Можно загрузить до 6 изображений' })
  imgs?: Express.Multer.File[];
}
