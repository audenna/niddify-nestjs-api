import { CreatePasswordDto } from '../../../common/dto/fields/create.password.dto';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AccountBlockingAction } from '../enums/account-blocking-action.enum';

export class CreateAccountDeactivationDto extends CreatePasswordDto {
  @IsIn(Object.values(AccountBlockingAction))
  @IsString()
  @IsNotEmpty()
  requestType: AccountBlockingAction;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  remark?: string;
}
