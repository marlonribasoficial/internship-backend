import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import appleSigninAuth from 'apple-signin-auth';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(req: Request): Promise<OAuthProfile> {
    const identityToken = req.body?.identityToken as string | undefined;
    const name = req.body?.name as string | undefined;

    if (!identityToken) {
      throw new UnauthorizedException('identityToken is required');
    }

    try {
      const payload = await appleSigninAuth.verifyIdToken(identityToken, {
        audience: this.configService.getOrThrow<string>('APPLE_CLIENT_ID'),
      });

      return {
        appleId: payload.sub,
        email: payload.email,
        name: name ?? payload.email?.split('@')[0] ?? 'User',
      };
    } catch {
      throw new UnauthorizedException('Invalid Apple identity token');
    }
  }
}
