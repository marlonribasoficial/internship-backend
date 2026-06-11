import { IsDate, IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    nickname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    hashedPassword: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    birthDate: Date;

    @IsOptional()
    @IsUrl()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    bio?: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}