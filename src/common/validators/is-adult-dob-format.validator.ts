import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsAdultDateFormat(validationOptions?: ValidationOptions) {
  let statusCode: number;
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsAdultDateFormat',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string') return false;

          // Match DD/MM/YYYY
          const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!regex.test(value)) return false;

          const [day, month, year] = value.split('/').map(Number);
          const dob = new Date(year, month - 1, day);

          if (
            dob.getDate() !== day ||
            dob.getMonth() !== month - 1 ||
            dob.getFullYear() !== year
          ) {
            return false;
          }

          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          const dayDiff = today.getDate() - dob.getDate();

          const isOldEnough: boolean =
            age > 18 ||
            (age === 18 &&
              (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

          if (!isOldEnough) {
            statusCode = 2;
            return false;
          }

          return true;
        },

        defaultMessage(): string {
          return statusCode === 2
            ? 'Sorry, you must be at least 18 years old'
            : 'Date of birth must be in DD/MM/YYYY format';
        },
      },
    });
  };
}
