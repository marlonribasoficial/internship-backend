import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppleSignInDto {
  @IsString()
  @IsNotEmpty()
  identityToken: string;

  // Apple só envia o nome na primeira autorização — o app iOS deve mandar aqui
  @IsOptional()
  @IsString()
  name?: string;
}
