import { ProductCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetAllPopularQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? 20 : num;
  })
  limit: number = 20;

  @IsOptional()
  @IsEnum(ProductCategory, {
    message: `Введена несущетсвующая категория, введите одну из списка: ${Object.values(ProductCategory).join(', ')}`,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  category?: ProductCategory;
}
