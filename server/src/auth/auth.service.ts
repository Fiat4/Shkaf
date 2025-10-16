// src/auth/auth.service.ts
import { ConflictException, Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AdminLoginDto, CreateAdminDto } from './dto/admin-auth.dto.ts';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt.payload.interface.js';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = config.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = config.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async registration(user: CreateAdminDto, res: Response) {
    const { username, password } = user;
    const candidate = await this.prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (candidate) {
      throw new ConflictException(
        'Пользователь с таким эмейлом уже существует',
      );
    }
    const crdUser = await this.prisma.admin.create({
      data: {
        username,
        password: await hash(password),
      },
    });

    return this.auth(res, {
      id: crdUser.id,
      roles: 'admin',
    });
  }



  async login(res: Response, userData: AdminLoginDto) {
    const { username, password } = userData;
    const candidate = await this.prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (!candidate) {
      throw new NotFoundException('Ползователя с таким эмейлом не существует.');
    }
    const isValidPawsword = await verify(candidate.password, password);

    if (!isValidPawsword) {
      throw new UnauthorizedException('Неверный пароль');
    }


    return await this.auth(res, { id: candidate.id, roles: 'admin' });
  }

  async logout(res: Response) {
    this.setCookie(res, '', new Date(0));
    return true;
  }

  private async generateToken(payload: JwtPayload) {
    return {
      refreshToken: await this.jwt.signAsync(payload, {
        expiresIn: this.JWT_REFRESH_TOKEN_TTL,
      }),
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: this.JWT_ACCESS_TOKEN_TTL,
      }),
    };
  }

  async refreshTokens(req: Request, res: Response) {
    const access = req.cookies['refreshToken'];

    if (!access) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const payload: JwtPayload = await this.jwt.verifyAsync(access);

    if (payload) {
      const candidate = await this.prisma.admin.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!candidate) {
        throw new NotFoundException('Пользователь не найден');
      }
      return this.auth(res, { id: candidate.id, roles: 'admin' });
    }
  }

  private async setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      expires,
      httpOnly: true,
      // domain: 'localhost',
      secure: false,
      sameSite: 'lax',
    });
  }

  private async auth(res: Response, payload: JwtPayload) {
    const { refreshToken, accessToken } = await this.generateToken(payload);

    console.log(refreshToken, accessToken)


    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    );


    return { accessToken };
  }

  async validate(payload: JwtPayload) {
    const candidate = await this.prisma.admin.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!candidate) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return candidate;
  }
}