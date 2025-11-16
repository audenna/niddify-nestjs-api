import { PartialType } from '@nestjs/mapped-types';
import { CreateModelDto } from './create-model.dto';

export class UpdateNamedModelDto extends PartialType(CreateModelDto) {}
