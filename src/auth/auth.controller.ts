import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AppleSignInDto } from './dto/apple-sign-in.dto';
import { AppleAuthGuard } from './guards/apple-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { OAuthProfile } from './interfaces/oauth-profile.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('apple')
  @UseGuards(AppleAuthGuard)
  appleSignIn(@Req() req: Request & { user: OAuthProfile }) {
    return this.authService.oauthLogin(req.user);
  }

  @Post('google')
  @UseGuards(GoogleAuthGuard)
  googleSignIn() {
    // Implementar quando GoogleStrategy estiver pronto
  }
}
