import { IsIn, IsNotEmpty } from 'class-validator';
import { UserTypes } from '../../../common/enums/user.types';

export class UserTypeValidateDto {
  @IsIn(Object.values(UserTypes))
  @IsNotEmpty({ message: 'User type is required' })
  userType: UserTypes;
}
