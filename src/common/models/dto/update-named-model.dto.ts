import { PartialType } from '@nestjs/mapped-types';
import { CreateNamedModelDto } from './create-named-model.dto';

export class UpdateNamedModelDto extends PartialType(CreateNamedModelDto) {}
