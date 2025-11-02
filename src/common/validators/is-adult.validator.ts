import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAdult', async: false })
export class IsAdult implements ValidatorConstraintInterface {
  validate(dateStr: string): boolean {
    const birthDate = new Date(dateStr);
    const now = new Date();

    if (birthDate >= now) {
      return false; // Birthdate cannot be in the future
    }

    const ageDifMs = now.getTime() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // Epoch time diff
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age >= 18; // Must be 18 or older
  }

  defaultMessage(): string {
    return 'You must be at least 18 years old to proceed';
  }
}
