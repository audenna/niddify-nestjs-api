import { IEmailOptions } from '../interfaces/email.options.interface';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EmailOptionsDto implements IEmailOptions {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsEmail()
  @IsNotEmpty()
  subject: string;

  @IsEmail()
  @IsNotEmpty()
  templateName: string;

  @IsOptional()
  context?: Record<string, any>;

  @Min(3)
  @IsString()
  @IsOptional()
  mailFromName?: string;

  @IsEmail()
  @IsOptional()
  mailFromEmail?: string;
}
