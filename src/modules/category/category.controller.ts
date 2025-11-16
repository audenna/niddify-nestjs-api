import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, maxFileSize } from '../../common/validators';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter(['png', 'jpg', 'jpeg']),
      limits: maxFileSize(5 * 1024 * 1024), // 5MB
    }),
  )
  @Post()
  async addCategory(
    @Body() dto: CreateModelDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.service.addCategory(dto, file);
  }

  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter(['png', 'jpg', 'jpeg']),
      limits: maxFileSize(5 * 1024 * 1024), // 5MB
    }),
  )
  @Patch('/:uuid')
  async updateCategory(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateNamedModelDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return await this.service.updateCategory(uuid, dto, file);
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
