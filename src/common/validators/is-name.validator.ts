import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function isNameValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isNameValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return (
            typeof value === 'string' && /^[A-Za-z\s-]+$/.test(value.trim())
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} can only contain letters, spaces, or hyphens`;
        },
      },
    });
  };
}
