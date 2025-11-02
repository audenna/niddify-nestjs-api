import { Injectable } from '@nestjs/common';
import { FirstAndLastDate } from '../interfaces/first.and.last.day.output.interface';
import {
  DateRange,
  IDayRange,
  IMonthRange,
  PeriodRange,
} from '../interfaces/date.range.interface';
import { Period } from '../../enums/period.enum';

@Injectable()
export class DateUtil {
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getYMDFromDateString(dateString: Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getFirstAndLastDayFromDateString(dateString: Date): FirstAndLastDate {
    const firstDay = new Date(
      dateString.getFullYear(),
      dateString.getMonth(),
      1,
    );

    const lastDay = new Date(
      dateString.getFullYear(),
      dateString.getMonth() + 1,
      0,
    );

    return {
      firstDay: firstDay.toISOString().split('T')[0], // 2025-04-01
      lastDay: lastDay.toISOString().split('T')[0], // 2025-04-30
    };
  }

  getMonthToMonthDateRange(): IMonthRange {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthStart = new Date(currentYear, currentMonth, 1);

    const today = new Date(
      currentYear,
      currentMonth,
      now.getDate(),
      23,
      59,
      59,
    );

    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthSameDay = new Date(
      currentYear,
      currentMonth - 1,
      now.getDate(),
      23,
      59,
      59,
    );

    return {
      currentMonth: {
        startDate: thisMonthStart,
        endDate: today,
      },
      previousMonth: {
        startDate: lastMonthStart,
        endDate: lastMonthSameDay,
      },
    };
  }

  getDayRange(): IDayRange {
    const today = new Date();
    const previousMonthSameDay = new Date(today);
    previousMonthSameDay.setMonth(today.getMonth() - 1);

    // Handle cases like March 31 -> Feb 28
    if (previousMonthSameDay.getMonth() === today.getMonth()) {
      previousMonthSameDay.setDate(0);
    }

    const getDayStartEnd = (date: Date): DateRange => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    };

    return {
      currentDay: getDayStartEnd(today),
      previousDay: getDayStartEnd(previousMonthSameDay),
    };
  }

  getRanges(period: Period): PeriodRange {
    const now = new Date();
    let currentStart: Date, currentEnd: Date;
    let previousStart: Date, previousEnd: Date;

    switch (period) {
      case Period.DAY: {
        currentStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        currentEnd = new Date(currentStart);
        currentEnd.setHours(23, 59, 59, 999);

        previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 1);

        previousEnd = new Date(previousStart);
        previousEnd.setHours(23, 59, 59, 999);
        break;
      }

      case Period.WEEK: {
        const day = now.getDay(); // Sunday=0
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        currentStart = new Date(now.getFullYear(), now.getMonth(), diff);
        currentStart.setHours(0, 0, 0, 0);

        currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + 6);
        currentEnd.setHours(23, 59, 59, 999);

        previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 7);

        previousEnd = new Date(currentEnd);
        previousEnd.setDate(previousEnd.getDate() - 7);
        break;
      }

      case Period.MONTH: {
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        currentEnd.setHours(23, 59, 59, 999);

        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        previousEnd.setHours(23, 59, 59, 999);
        break;
      }

      case Period.YEAR: {
        currentStart = new Date(now.getFullYear(), 0, 1);
        currentEnd = new Date(now.getFullYear(), 11, 31);
        currentEnd.setHours(23, 59, 59, 999);

        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31);
        previousEnd.setHours(23, 59, 59, 999);
        break;
      }

      default:
        throw new Error('The selected period is invalid');
    }

    return {
      current: { startDate: currentStart, endDate: currentEnd },
      previous: { startDate: previousStart, endDate: previousEnd },
    };
  }

  hasOtpExpired(otpExpiryDate: any): boolean {
    if (!otpExpiryDate || !(otpExpiryDate instanceof Date)) return true; // expired by default

    const now = new Date();
    return now.getTime() > otpExpiryDate.getTime(); // true means expired
  }
}
