import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!regex.test(value)) return false;

          const [day, month, year] = value.split('/').map(Number);
          const date = new Date(`${year}-${month}-${day}`);
          if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
          ) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
