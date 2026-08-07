import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AdminLoginDto, CreateAdminDto } from './dto/admin-auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JWTAuthGuard } from './guards/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async adminLogin(@Body() userData: AdminLoginDto, @Res() res: Response) {
    const result = await this.authService.login(res, userData);
    return res.status(201).json(result);
  }

  @UseGuards(JWTAuthGuard)
  @Post('reg')
  async adminReg(
    @Body() userData: CreateAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.registration(userData, res);
  }

  @UseGuards(JWTAuthGuard)
  @Post('logout')
  async adminLogout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JWTAuthGuard)
  @Get('check')
  async checkAuth() {
    return { message: 'Авторизован' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refreshTokens(req, res);
    return res.status(201).json(result);
  }
}
