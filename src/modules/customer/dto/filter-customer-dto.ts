import { PaginationFiltersDto } from '../../../common/dto/filters/pagination-filters.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { UserPresenceStatusEnum } from '../../../common/enums';
import { Period } from '../../../common/enums/period.enum';

export class FilterCustomerDto extends PaginationFiltersDto {
  @IsIn(Object.values(Period))
  @IsString()
  @IsOptional()
  period: Period;

  @IsIn(Object.values(UserPresenceStatusEnum))
  @IsString()
  @IsOptional()
  presenceStatus: string;
}
