import { ArrayMaxSize, ArrayMinSize, IsIn, IsNumber } from 'class-validator';

export class CreateCoordinatesDto {
  @IsIn(['Point'])
  type: 'Point';

  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}