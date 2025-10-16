import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const response = context.switchToHttp().getResponse<Response>();

        // Если есть ошибка верификации токена
        if (info instanceof Error) {
            response.clearCookie('refreshToken');

            if (info.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Сессия истекла. Пожалуйста, войдите снова.');
            } else if (info.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Невалидный токен');
            } else if (info.name === 'NotBeforeError') {
                throw new UnauthorizedException('Токен еще не активен');
            }
        }

        // Если есть другая ошибка или пользователь не найден
        if (err || !user) {
            response.clearCookie('refreshToken');
            throw new UnauthorizedException('Ошибка авторизации');
        }

        return user;
    }
}