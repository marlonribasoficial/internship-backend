import { IsEnum, IsUrl } from 'class-validator';
import { MediaType } from 'src/schemas/post/media.schema';

export class CreateMediaDto {
  @IsEnum(MediaType)
  type: MediaType;

  @IsUrl()
  url: string;
}