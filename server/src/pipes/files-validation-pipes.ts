
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UploadedCreateFilesDto, UploadedUpdateFilesDto } from 'src/product/dto/uploaded-files.dto';

@Injectable()
export class UploadedCreateFilesValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
        throw new BadRequestException('Изображения аватара и товара обязательны.');
    }

    const object = plainToInstance(UploadedCreateFilesDto, value);
    const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
        const messages = errors.map(err => {
        return Object.values(err.constraints || {}).join(', ');
        }).join('; ');
        throw new BadRequestException(`Ошибка валидации файлов: ${messages}`);
    }
    return value; // Возвращаем оригинальный объект файлов Multer
    }
}

@Injectable()
export class UploadedUpdateFilesValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
    // Если файлов нет или это пустой объект, то это нормально для необязательных файлов
    if (!value || (Object.keys(value).length === 0)) {
        return value; // Пропускаем, @IsOptional() в DTO обработает отсутствие
    }

    const object = plainToInstance(UploadedUpdateFilesDto, value);
    const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
        const messages = errors.map(err => {
        return Object.values(err.constraints || {}).join(', ');
        }).join('; ');
        throw new BadRequestException(`Ошибка валидации файлов: ${messages}`);
    }
    return value; // Возвращаем оригинальный объект файлов Multer
    }
}