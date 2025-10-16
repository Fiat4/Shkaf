import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { AdminController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  controllers: [AdminController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtRefreshStrategy],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
      inject: [ConfigService],
    }),
  ]
})
export class AuthModule { }
