import { Validate, ValidationOptions } from 'class-validator';
import { AtLeastOneFieldConstraint } from '../validators';

export function AtLeastOneField(validationOptions?: ValidationOptions) {
  return function (object: object) {
    Validate(AtLeastOneFieldConstraint, validationOptions)(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      object as any,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      undefined,
    );
  };
}
