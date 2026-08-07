import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateOrderDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(2, { message: 'Имя пользователя от 2х символов' })
  @MaxLength(100, { message: 'Имя пользователя не более 100 символов' })
  userName: string;

  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @IsPhoneNumber('RU', { message: 'Введите корректный номер телефона' })
  tel: string;

  @IsOptional()
  @IsString({ message: 'Идентификатор продукта должен быть строкой' })
  product?: string;

  @IsOptional()
  @IsString({ message: 'Комментарий должен быть строкой' })
  @MaxLength(1000, { message: 'Комментарий не более 1000 символов' })
  comment?: string;
}
