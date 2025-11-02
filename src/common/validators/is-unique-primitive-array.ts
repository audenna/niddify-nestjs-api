import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that all values in a primitive array are unique.
 *
 * Example: @IsUniqueArray()
 */
export function IsUniqueArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          const unique = new Set(value);
          return unique.size === value.length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain unique values`;
        },
      },
    });
  };
}
