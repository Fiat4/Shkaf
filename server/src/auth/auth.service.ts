import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminLoginDto, CreateAdminDto } from './dto/admin-auth.dto';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtTokenType } from './interfaces/jwt.payload.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = config.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL').trim();
    this.JWT_REFRESH_TOKEN_TTL = config.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL').trim();
    this.JWT_SECRET = config.getOrThrow<string>('JWT_SECRET');
    this.JWT_REFRESH_SECRET =
      config.get<string>('JWT_REFRESH_SECRET')?.trim() || this.JWT_SECRET;
  }

  async registration(user: CreateAdminDto, res: Response) {
    const { username, password } = user;
    const candidate = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (candidate) {
      throw new ConflictException(
        'Пользователь с таким именем уже существует',
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
      where: { username },
    });

    if (!candidate) {
      throw new NotFoundException('Пользователя с таким именем не существует.');
    }

    if (!candidate.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    const isValidPassword = await verify(candidate.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return await this.auth(res, { id: candidate.id, roles: 'admin' });
  }

  async logout(res: Response) {
    this.setCookie(res, '', new Date(0));
    return true;
  }

  private async generateToken(payload: Omit<JwtPayload, 'type'>) {
    return {
      refreshToken: await this.jwt.signAsync(
        { ...payload, type: 'refresh' as JwtTokenType },
        {
          secret: this.JWT_REFRESH_SECRET,
          expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        },
      ),
      accessToken: await this.jwt.signAsync(
        { ...payload, type: 'access' as JwtTokenType },
        {
          secret: this.JWT_SECRET,
          expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        },
      ),
    };
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }

    if (payload.type && payload.type !== 'refresh') {
      throw new UnauthorizedException('Неверный тип токена');
    }

    const candidate = await this.prisma.admin.findUnique({
      where: { id: payload.id },
      select: { id: true, isActive: true },
    });

    if (!candidate) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!candidate.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    return this.auth(res, { id: candidate.id, roles: 'admin' });
  }

  private parseTtlToMs(ttl: string): number {
    const match = ttl.trim().match(/^(\d+)([smhd])$/i);
    if (!match) {
      return 1000 * 60 * 60 * 24 * 14;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] ?? multipliers.d);
  }

  private async setCookie(res: Response, value: string, expires: Date) {
    const domain = process.env.COOKIE_DOMAIN?.trim();
    res.cookie('refreshToken', value, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(domain ? { domain } : {}),
    });
  }

  private async auth(res: Response, payload: Omit<JwtPayload, 'type'>) {
    const { refreshToken, accessToken } = await this.generateToken(payload);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + this.parseTtlToMs(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return { accessToken };
  }

  async validate(payload: JwtPayload, expectedType?: JwtTokenType) {
    if (expectedType && payload.type && payload.type !== expectedType) {
      throw new UnauthorizedException('Неверный тип токена');
    }

    const candidate = await this.prisma.admin.findUnique({
      where: { id: payload.id },
    });

    if (!candidate) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!candidate.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    return candidate;
  }
}
