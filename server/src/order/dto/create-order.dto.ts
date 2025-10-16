import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateOrderDto {
  @IsString({message: 'Имя пользователя должно быть строкой'})
  @MinLength(2, {message: 'Имя пользователя от 2х символов'})
  @MinLength(2, {message: 'Имя пользователя до 5 символов'})
  userName: string;
  @IsEmail({}, {message: 'Введите кореектный email'})
  email: string;
  @IsPhoneNumber('RU', {message: 'Введите корректный номер телефона'})
  tel: string;
  @IsOptional()
  @IsString({message: 'Идентификатор продукта должен быть строкой'})
  product?: string;
}
