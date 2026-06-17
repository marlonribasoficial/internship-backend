import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCoordinatesDto } from './create-coordinates.dto';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  placeId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCoordinatesDto)
  coordinates: CreateCoordinatesDto;
}