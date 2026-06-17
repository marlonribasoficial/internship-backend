import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsNumber } from 'class-validator';

export class CreateCoordinatesDto {
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}