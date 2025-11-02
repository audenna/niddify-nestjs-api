import { CreatePasswordDto } from '../../../common/dto/fields/create.password.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePasswordResetDto extends CreatePasswordDto {
  @IsUUID()
  @IsNotEmpty({ message: 'No User ID detected' })
  uuid: string;
}
