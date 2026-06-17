import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, MaxDate, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  nickname: string;

  @Type(() => Date)
  @IsDate()
  @MaxDate(() => new Date(), { message: 'birthDate cannot be in the future' })
  birthDate: Date;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;
}