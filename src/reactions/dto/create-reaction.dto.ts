import { IsEnum } from 'class-validator';
import { Type } from '../../schemas/reaction.schema';

export class CreateReactionDto {
  @IsEnum(Type)
  type: Type;
}
