import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh: string }) {
    const { refresh } = body;

    if (!refresh) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshToken(refresh);
  }
}
