import { ProductCategory } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductCategory, {
    message: `Введена несущетсвующая категория, введите одну из списка: ${Object.values(ProductCategory).join(', ')}`,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  category?: ProductCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Max(30000000)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  minHeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  maxHeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  minWidth?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  maxWidth?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  minDepth?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  })
  maxDepth?: number;

  @IsOptional()
  @IsString()
  @IsIn([
    'name',
    'price',
    'created_at',
    'updated_at',
    'height',
    'width',
    'depth',
    'popularityScore'
  ])
  sortBy: string = 'created_at';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? 1 : num;
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? 20 : num;
  })
  limit: number = 20;
}
