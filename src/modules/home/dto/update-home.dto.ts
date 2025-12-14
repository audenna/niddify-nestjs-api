import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { isNameValid } from '../../../common/validators';

export class UpdateHomeDto {
  @isNameValid()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  briefDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsLatitude()
  @IsOptional()
  lat?: number;

  @IsLongitude()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}
