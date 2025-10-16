import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class CreateOrganizationReviewDto {
  @IsNotEmpty({ message: "Имя пользователя обязательно" })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @Length(2, 50, { message: 'Имя пользователя должно содержать от 2 до 50 символов' })
  username: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Рейтинг должен быть числом' })
  @Min(1, { message: 'Минимальная оценка - 1' })
  @Max(5, { message: 'Максимальная оценка - 5' })
  rating: number;

  @IsEmail({}, { message: 'Введите корректный email' })
  @Length(5, 100, { message: 'Email должен содержать от 5 до 100 символов' })
  email: string;
  
  @IsNotEmpty({ message: "Введите текст отзыва" })
  @IsString({ message: 'Текст отзыва должен быть строкой' })
  @Length(5, 300, { message: 'Текст отзыва должен содержать от 5 до 300 символов' })
  review: string;
}

export class CreateProductReviewDto extends CreateOrganizationReviewDto {
  @IsNotEmpty({message: "Отзыв на продукт должен содержать идентификатор продукта"})
  @IsUUID('all', {message: "Отзыв на продукт должен содержать идентификатор продукта"})
  productId: string;
}
