import { Period } from '../../enums/period.enum';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class PeriodFilterDto {
  @IsIn(Object.values(Period))
  @IsString()
  @IsOptional()
  period: Period;
}
