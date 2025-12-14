import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  UserTypesAllowed,
  UserTypesGuard,
} from '../../../common/guards/user-types.guard';
import { UserTypes } from '../../../common/enums/user.types';
import { HomeService } from '../services/home.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { CreateHomeDto } from '../dto/create-home.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, maxFileSize } from '../../../common/validators';
import { UpdateHomeDto } from '../dto/update-home.dto';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@Controller('homes')
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Post()
  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logoFile', maxCount: 1 },
        { name: 'coverPhotos', maxCount: 10 },
      ],
      {
        fileFilter: imageFileFilter(['png', 'jpg', 'jpeg']),
        limits: maxFileSize(5 * 1024 * 1024), // 5MB
      },
    ),
  )
  async addHome(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateHomeDto,
    @UploadedFiles()
    files: {
      logoFile?: Express.Multer.File[];
      coverPhotos?: Express.Multer.File[];
    },
  ): Promise<any> {
    const logo = (files?.logoFile?.[0] as Express.Multer.File) ?? null;
    const covers = (files?.coverPhotos as Express.Multer.File[]) ?? [];

    return await this.service.addHome(user, dto, logo, covers);
  }

  @Patch('/:homeId')
  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  async updateHome(
    @Param('homeId', ParseIntPipe) homeId: number,
    @Body() dto: UpdateHomeDto,
  ): Promise<any> {
    return this.service.updateHome(homeId, dto);
  }

  @Delete('/:homeId')
  @UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
  async deleteHome(
    @Param('homeId', ParseIntPipe) homeId: number,
  ): Promise<any> {
    return this.service.deleteHome(homeId);
  }
}
