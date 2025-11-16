import { Injectable } from '@nestjs/common';
import { NamedModelService } from '../../common/models/services/named-model.service';
import { Util } from '../../common/utils';
import { AppLogger } from '../../core/logger/logger.service';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoryService extends NamedModelService {
  constructor(
    protected readonly repository: CategoryRepository,
    protected readonly utils: Util,
    protected readonly logger: AppLogger,
  ) {
    super(repository, utils, logger);
  }
}
