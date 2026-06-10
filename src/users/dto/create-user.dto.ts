import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(['tourist', 'local'], { message: 'Role must be either tourist or local' })
    @IsNotEmpty()
    role: 'tourist' | 'local';
}