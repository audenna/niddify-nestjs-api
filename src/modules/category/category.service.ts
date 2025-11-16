import { Injectable } from '@nestjs/common';
import { NamedModelService } from '../../common/models/services/named-model.service';
import { Util } from '../../common/utils';
import { AppLogger } from '../../core/logger/logger.service';
import { CategoryRepository } from './repositories/category.repository';
import { CreateModelDto } from '../../common/models/dto/create-model.dto';
import { FileUploadService } from '../../core/file-upload/file-upload.service';
import { Category } from './models/category.model';
import { UpdateNamedModelDto } from '../../common/models/dto/update-named-model.dto';

@Injectable()
export class CategoryService extends NamedModelService {
  constructor(
    protected readonly repository: CategoryRepository,
    protected readonly utils: Util,
    protected readonly logger: AppLogger,
    private readonly fileService: FileUploadService,
  ) {
    super(repository, utils, logger);
  }

  async addCategory(
    dto: CreateModelDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    if (file) {
      const res = await this.fileService.handleFileUpload(file);
      dto['iconUrl'] = res?.url;
    }

    return await this.create(dto);
  }

  async updateCategory(
    uuid: string,
    dto: UpdateNamedModelDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    if (file) {
      const res = await this.fileService.handleFileUpload(file);
      dto['iconUrl'] = res?.url;
    }

    return await this.updateById(uuid, dto);
  }
}
