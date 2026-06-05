export class CreateUserDto {
    name: string;
    email: string;
    role: 'tourist' | 'local';
}