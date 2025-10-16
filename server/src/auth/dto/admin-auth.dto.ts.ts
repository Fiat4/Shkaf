import { IsString, MinLength } from "class-validator"

export class AdminLoginDto {
    @IsString({ message: 'Имя пользователя должно быть строкой' })
    username: string

    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string
}

export class CreateAdminDto {
    @IsString()
    @MinLength(4, { message: 'Имя пользователя должно содержать минимум 4 символа' })
    username: string

    @IsString()
    @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
    password: string
}