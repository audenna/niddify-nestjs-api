import { IsNotEmpty, Length, Matches } from 'class-validator';

export function IsOtpValidator() {
  return (target: object, propertyKey: string | symbol) => {
    const key = propertyKey.toString();
    IsNotEmpty({ message: `${key} should not be empty` })(target, propertyKey);
    Matches(/^\d+$/, { message: `${key} must be numeric` })(
      target,
      propertyKey,
    );
    Length(6, 6, { message: `${key} must be at least 6 characters` })(
      target,
      propertyKey,
    );
  };
}
