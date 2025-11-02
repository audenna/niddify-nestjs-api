import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDOBFormat(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsValidDOBFormat',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string') return false;

          // DD/MM/YYYY format
          const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!regex.test(value)) return false;

          // Parse date and check if it's valid
          const [day, month, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);

          return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          );
        },
        defaultMessage(): string {
          return 'Date of birth must be in DD/MM/YYYY format';
        },
      },
    });
  };
}
