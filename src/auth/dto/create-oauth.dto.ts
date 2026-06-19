import { IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional, ValidateIf } from 'class-validator';

export class CreateOAuthUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsNotEmpty()
  appleId?: string;

  @ValidateIf(o => !o.appleId)
  @IsString()
  @IsNotEmpty()
  googleId?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}