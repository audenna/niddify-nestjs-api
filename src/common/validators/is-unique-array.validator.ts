import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function IsUniqueArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueArray',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[]): boolean {
          if (!Array.isArray(value)) return false;
          const uniqueValues = new Set(value);
          return uniqueValues.size === value.length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain unique values`;
        },
      },
    });
  };
}
