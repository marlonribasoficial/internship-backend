import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateBy, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeTag } from 'src/schemas/post/post.schema';
import { CreateLocationDto } from './create-location.dto';
import { CreateMediaDto } from './create-media.dto';

export class CreatePostDto {

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsEnum(TypeTag)
  typeTag: TypeTag;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @ValidateBy({
    name: 'isHalfStar',
    validator: {
      validate: (value: number) => value % 0.5 === 0,
    },
  })
  rating?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  media?: CreateMediaDto[];
  
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsBoolean()
  showUserData: boolean;
}