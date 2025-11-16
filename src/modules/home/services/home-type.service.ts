import { Injectable } from '@nestjs/common';
import { NamedModelService } from '../../../common/models/services/named-model.service';
import { Util } from '../../../common/utils';
import { AppLogger } from '../../../core/logger/logger.service';
import { HomeTypeRepository } from '../repositories';

@Injectable()
export class HomeTypeService extends NamedModelService {
  constructor(
    protected readonly repository: HomeTypeRepository,
    protected readonly utils: Util,
    protected readonly logger: AppLogger,
  ) {
    super(repository, utils, logger);
    this.logger = logger.withContext(HomeTypeService.name);
  }
}
