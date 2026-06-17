import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

/**
 * Stub para Google Sign-In — implementar depois com verifyIdToken do Google.
 * O fluxo será igual ao Apple: POST /auth/google com idToken no body.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super();
  }

  validate(_req: Request): never {
    throw new UnauthorizedException('Google sign-in not implemented yet');
  }
}
