import { IsCommaSeparated } from '../decorators/is-comma-separated.decorator';
import { isEmail, isInt, isString } from 'class-validator';

export function IsCommaSeparatedEmails(validationOptions?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return IsCommaSeparated(isEmail, validationOptions);
}

export function IsCommaSeparatedNumbers(validationOptions?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return IsCommaSeparated((v) => isInt(Number(v)), validationOptions);
}

export function IsCommaSeparatedString(validationOptions?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return IsCommaSeparated((v) => isString(String(v)), validationOptions);
}
