import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  comment?: string;
  products?: string;
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  @IsEnum(OrderStatus, {
      message: `Введена несущетсвующая категория, введите одну из списка: ${Object.values(OrderStatus).join(', ')}`
    })
  status: OrderStatus
}
