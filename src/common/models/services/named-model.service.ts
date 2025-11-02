import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NamedModel } from '../models';
import { BaseRepository } from '../../repositories/base.repository';
import { CreateNamedModelDto } from '../dto/create-named-model.dto';
import { Util } from '../../utils';
import { AppLogger } from '../../../core/logger/logger.service';
import { CreationAttributes, Op, WhereOptions } from 'sequelize';
import { successResponse } from '../../dto/api-response/api.response.handler';
import { ResponseCode } from '../../enums';
import { UpdateNamedModelDto } from '../dto/update-named-model.dto';
import { PaginationFiltersDto } from '../../dto/filters/pagination-filters.dto';

@Injectable()
export abstract class NamedModelService {
  protected constructor(
    protected readonly repository: BaseRepository<NamedModel>,
    protected readonly utils: Util,
    protected readonly logger: AppLogger,
  ) {
    this.logger = logger.withContext(NamedModelService.name);
  }

  async fetchAll(filters: PaginationFiltersDto): Promise<any> {
    filters.size = filters?.size ?? 10;
    let where = {};

    if (filters.searchTerm) {
      where = { ...where, name: { [Op.like]: `%${filters.searchTerm}%` } };
    }

    const result = await this.repository.findWithCursorPagination({
      limit: filters.size,
      cursor: filters.cursor,
      cursorField: 'updatedAt',
      where,
      orderDirection: 'DESC',
    });

    return successResponse(ResponseCode.OK, result, 'Record results');
  }

  async create(dto: CreateNamedModelDto): Promise<any> {
    this.logger.log('Creating a new record...');

    dto.name = this.utils.capitalizeFirstLetters(
      this.utils.sanitizeString(dto.name),
    );

    if (await this.repository.findOneByCondition({ name: dto.name })) {
      throw new BadRequestException('A record with this name already exists');
    }

    try {
      const record = await this.repository.create(
        dto as unknown as CreationAttributes<NamedModel>,
      );

      return successResponse(
        ResponseCode.OK,
        record,
        'A new record has been created successfully',
      );
    } catch (e) {
      this.logger.error('Unable to create a new record');
      this.logger.error(e);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteById(id: number, condition: WhereOptions = {}): Promise<any> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid record selected');
    }

    const record = condition
      ? await this.repository.findOneByCondition(condition)
      : await this.repository.findOneById(id);

    if (!record) throw new NotFoundException('Record not found');
    try {
      await this.repository.delete(id);
      return successResponse(
        ResponseCode.OK,
        null,
        'Record deleted successfully',
      );
    } catch (e) {
      this.logger.error('Unable to delete a record');
      this.logger.error(e);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async updateById(id: number, dto: UpdateNamedModelDto): Promise<any> {
    if (!(await this.repository.findOneById(id))) {
      throw new NotFoundException('Record not found');
    }

    if (dto.name) dto.name = this.utils.sanitizeString(dto.name);

    if (!Object.values(dto).length) {
      throw new BadRequestException('At least a field must be updated');
    }

    if (await this.repository.findOneByCondition({ name: dto.name })) {
      throw new BadRequestException('A record with this name already exists');
    }

    try {
      const record = await this.repository.update(id, dto);
      return successResponse(
        ResponseCode.OK,
        record,
        'Record updated successfully',
      );
    } catch (e) {
      this.logger.error('Unable to update an Record');
      this.logger.error(e);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
