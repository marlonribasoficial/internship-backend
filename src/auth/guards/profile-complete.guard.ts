import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user as JwtPayload;

    if (!user.isProfileComplete) {
      throw new ForbiddenException('Complete your profile before accessing this resource');
    }

    return true;
  }
}
