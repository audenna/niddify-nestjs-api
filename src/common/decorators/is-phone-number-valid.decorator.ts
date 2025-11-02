import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsPhoneNumberValid } from '../validators';

export function IsPhoneNumberValidDecorator(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneNumberValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneNumberValid,
    });
  };
}
