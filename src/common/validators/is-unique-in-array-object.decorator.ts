import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that the given property inside an array of objects is unique.
 *
 * Example: @IsUniqueInArrayObject('featureId')
 */
export function IsUniqueInArrayObject(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueInArrayObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const prop = args.constraints[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
          const values = value.map((item) => item[prop]);
          const unique = new Set(values);
          return unique.size === values.length;
        },
        defaultMessage(args: ValidationArguments) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const prop = args.constraints[0];
          return `${prop} values in ${args.property} must be unique`;
        },
      },
    });
  };
}
