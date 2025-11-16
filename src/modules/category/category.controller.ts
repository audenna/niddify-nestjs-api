import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  UserTypesAllowed,
  UserTypesGuard,
} from '../../common/guards/user-types.guard';
import { UserTypes } from '../../common/enums/user.types';
import { CreateModelDto } from '../../common/models/dto/create-model.dto';
import { UpdateNamedModelDto } from '../../common/models/dto/update-named-model.dto';
import { PaginationFiltersDto } from '../../common/dto/filters/pagination-filters.dto';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Post()
  async addCategory(@Body() dto: CreateModelDto): Promise<any> {
    return await this.service.create(dto);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Patch('/:uuid')
  async updateCategory(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateNamedModelDto,
  ): Promise<any> {
    return await this.service.updateById(uuid, dto);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @Delete('/:uuid')
  async deleteCategory(@Param('uuid') uuid: string): Promise<any> {
    return await this.service.deleteById(uuid);
  }

  @Get()
  async findAll(@Query() filters: PaginationFiltersDto): Promise<any> {
    return await this.service.fetchAll(filters);
  }
}
