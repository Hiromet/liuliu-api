import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '60m' },
      );

      return { access: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access: this.jwtService.sign(payload, { expiresIn: '60m' }),
      refresh: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
