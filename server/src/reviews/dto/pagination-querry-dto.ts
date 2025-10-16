import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export enum EntityType {
  ORGANIZATION = 'organization',
  PRODUCT = 'product'
}

export class ReviewQuerryDTO {
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

    @IsOptional()
    @IsEnum(EntityType, {message: "Существует всего 2 типа - организация и продукт. Не указывайте тип если хотите получить список всех отзывов."})
    type?: EntityType

    @IsOptional()
    @IsString()
    @IsIn([
        'username',
        'rating',
        'created_at',
        
    ])
    sortBy: string = 'created_at';

    @IsOptional()
    @IsString()
    search?: string;
}

