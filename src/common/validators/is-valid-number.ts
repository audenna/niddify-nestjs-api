import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return (
            typeof value === 'number' ||
            (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a numeric value`;
        },
      },
    });
  };
}
