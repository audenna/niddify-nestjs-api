import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export function IsPinValidator() {
  return (target: object, propertyKey: string | symbol) => {
    const key = propertyKey.toString();

    IsNotEmpty({ message: `${key} should not be empty` })(target, propertyKey);
    IsString({ message: `${key} must be a string` })(target, propertyKey);
    Length(4, 4, { message: `${key} must be exactly 4 numeric values` })(
      target,
      propertyKey,
    );
    Matches(/^\d{4}$/, {
      message: `${key} must be numeric and 4 digits long`,
    })(target, propertyKey);
  };
}