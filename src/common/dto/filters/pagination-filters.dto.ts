import { IsValidNumber } from '../../validators';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationFiltersDto {
  @Type(() => Number)
  @IsValidNumber()
  @IsNotEmpty()
  size: number = 10;

  @IsString()
  @IsOptional()
  cursor?: string;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}
