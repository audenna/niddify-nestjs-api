import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (!value) return false;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const date = new Date(value);

          // If value is not a valid date
          if (isNaN(date.getTime())) {
            return false;
          }

          const now = new Date();
          return date.getTime() > now.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}
