import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  UserTypesAllowed,
  UserTypesGuard,
} from '../../../common/guards/user-types.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserTypes } from '../../../common/enums/user.types';
import { HomeTypeService } from '../services';
import { CreateModelDto } from '../../../common/models/dto/create-model.dto';
import { UpdateNamedModelDto } from '../../../common/models/dto/update-named-model.dto';
import { PaginationFiltersDto } from '../../../common/dto/filters/pagination-filters.dto';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('home-types')
export class HomeTypeController {
  constructor(private readonly service: HomeTypeService) {}

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Post()
  async createType(@Body() dto: CreateModelDto): Promise<any> {
    return await this.service.create(dto);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Patch('/:uuid')
  async updateType(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateNamedModelDto,
  ): Promise<any> {
    return await this.service.updateById(uuid, dto);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Delete('/:uuid')
  async deleteType(@Param('uuid') uuid: string): Promise<any> {
    return await this.service.deleteById(uuid);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Get()
  async fetchAll(@Query() filters: PaginationFiltersDto): Promise<any> {
    return await this.service.fetchAll(filters);
  }
}
