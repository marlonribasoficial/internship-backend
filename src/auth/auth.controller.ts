import { Body, Controller, ForbiddenException, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AppleAuthGuard } from './guards/apple-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { OAuthProfile } from './interfaces/oauth-profile.interface';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('apple')
  @UseGuards(AppleAuthGuard)
  appleSignIn(@Req() req: Request & { user: OAuthProfile }) {
    return this.authService.oauthLogin(req.user);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('google')
  @UseGuards(GoogleAuthGuard)
  googleSignIn() {
    // Implementar quando GoogleStrategy estiver pronto
  }
}
