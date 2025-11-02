import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export function IsPassword(shouldBeStrong: boolean = true) {
  return (target: object, propertyKey: string | symbol) => {
    const key = propertyKey.toString();

    IsNotEmpty({ message: `${key} should not be empty` })(target, propertyKey);
    IsString({ message: `${key} must be a string` })(target, propertyKey);
    MinLength(8, { message: `${key} must be at least 8 characters` })(
      target,
      propertyKey,
    );

    if (shouldBeStrong) {
      IsStrongPassword(
        {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        {
          message: `${key} must include uppercase, lowercase, number, and special character`,
        },
      )(target, propertyKey);
    }
  };
}
