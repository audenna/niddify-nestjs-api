import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PhoneUtil } from '../utils';

@ValidatorConstraint({ name: 'IsPhoneNumberValid', async: false })
@Injectable()
export class IsPhoneNumberValid implements ValidatorConstraintInterface {
  private errorCode: number;

  constructor(private readonly phoneUtil: PhoneUtil) {}

  validate(phoneNumber: string | null): boolean {
    if (!phoneNumber) return false;

    const maxPhoneDigits: number = this.phoneUtil.maxPhoneDigits;

    if (
      phoneNumber.length < maxPhoneDigits ||
      phoneNumber.length > maxPhoneDigits + 2
    ) {
      this.errorCode = 2;
      return false;
    }

    // Optional: Normalize elsewhere instead of mutating args.object
    return this.phoneUtil.isValidPhoneNumber(phoneNumber);
  }

  defaultMessage(): string {
    if (this.errorCode === 2) {
      return 'Phone number must be 11 digits';
    }

    return 'Enter a valid phone number';
  }
}
