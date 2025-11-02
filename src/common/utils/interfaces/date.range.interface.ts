export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PeriodRange {
  current: DateRange;
  previous: DateRange;
}

export interface IMonthRange {
  currentMonth: DateRange;
  previousMonth: DateRange;
}

export interface IDayRange {
  currentDay: DateRange;
  previousDay: DateRange;
}