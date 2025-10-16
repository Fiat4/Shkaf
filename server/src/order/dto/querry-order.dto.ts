import { OrderStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class QueryOrderDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
    @IsEnum(OrderStatus, {
        message: `Введена несущетсвующая категория, введите одну из списка: ${Object.values(OrderStatus).join(', ')}`
      })
    status?: OrderStatus

    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
    type?: 'CONSULTATION' | 'ORDER'
 }
