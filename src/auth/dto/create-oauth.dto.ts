import { IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateOAuthUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  appleId?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}