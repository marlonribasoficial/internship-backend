import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Reason } from '../../schemas/report.schema';

export class CreateReportDto {
  @IsEnum(Reason)
  reason: Reason;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
