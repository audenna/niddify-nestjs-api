import { INamedModelAttribute } from '../interfaces/named-model.attribute.interface';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateNamedModelDto implements INamedModelAttribute {
  @Length(3, 50)
  @IsString({ message: 'Name must be a valid string' })
  @IsNotEmpty({ message: 'Enter a name to proceed' })
  name: string;

  @MinLength(3)
  @IsString()
  @IsOptional()
  description: string;
}
