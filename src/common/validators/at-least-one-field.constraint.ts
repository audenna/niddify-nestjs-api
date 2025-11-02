import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneField', async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(obj: any) {
    if (!obj || typeof obj !== 'object') return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(obj).some(
      (v) => v !== undefined && v !== null && v !== '',
    );
  }

  defaultMessage() {
    return 'At least one field must be provided';
  }
}
