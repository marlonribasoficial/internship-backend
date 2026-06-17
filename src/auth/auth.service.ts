import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { OAuthProfile } from './interfaces/oauth-profile.interface';

export interface AuthResponse {
  accessToken: string;
  isProfileComplete: boolean;
  user: {
    id: string;
    name: string;
    email?: string;
    nickname?: string;
    photoUrl?: string;
    country?: string;
    isProfileComplete: boolean;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async oauthLogin(profile: OAuthProfile): Promise<AuthResponse> {
    const user = await this.usersService.findOrCreateOAuthUser(profile);
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: UserDocument): AuthResponse {
    const isProfileComplete = !!(user.nickname && user.birthDate && user.country);

    const payload: JwtPayload = {
      sub: user._id.toString(),
      isProfileComplete,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      isProfileComplete,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        photoUrl: user.photoUrl,
        country: user.country,
        isProfileComplete,
      },
    };
  }
}
