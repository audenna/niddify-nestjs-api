import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { isNameValid, IsPhoneNumberValid } from '../../../common/validators';

export class ContactPersonDto {
  @isNameValid()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @isNameValid()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @Validate(IsPhoneNumberValid)
  @IsNotEmpty()
  phoneNumber: string;
}

export class CreateHomeDto {
  @IsUUID()
  @IsNotEmpty()
  homeTypeUuid: string;

  @isNameValid()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  briefDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @IsEmail()
  @IsOptional()
  contactEmailAddress: string;

  @Validate(IsPhoneNumberValid)
  @IsOptional()
  contactPhoneNumber: string;

  @Type(() => ContactPersonDto)
  @Transform(({ value }): object => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @IsObject()
  @IsNotEmpty()
  adminContact: ContactPersonDto;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
