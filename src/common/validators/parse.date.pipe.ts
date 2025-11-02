import { PipeTransform, BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(
        `Invalid date format: ${value}. Use YYYY-MM-DD.`,
      );
    }

    const parsed = dayjs(value, 'YYYY-MM-DD', true);

    if (!parsed.isValid()) {
      throw new BadRequestException(
        `Invalid date: ${value}. Use YYYY-MM-DD and ensure it's a real calendar date.`,
      );
    }

    return parsed.toDate();
  }
}
