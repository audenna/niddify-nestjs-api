import { BadRequestException, Injectable } from '@nestjs/common';
import { ICountry } from '../../interfaces/country.interface';

@Injectable()
export class PhoneUtil {
  public readonly maxPhoneDigits: number = 11;
  public readonly defaultDialingCode: string = '+234';

  public sanitizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, '').replace(/-+/g, '');
  }

  public escapeStringForRegex = (string: string | null) => {
    if (!string) {
      throw new BadRequestException('Unable to determine phone number status');
    }

    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  public isValidPhoneNumber(phoneNumber: string, country?: ICountry): boolean {
    const clean = this.sanitizePhoneNumber(phoneNumber);

    const maxDigits = country?.maxAcceptedNumberDigits || this.maxPhoneDigits;

    // Remove country code if present
    let dialingCode = country?.dialingCode || this.defaultDialingCode;
    dialingCode = dialingCode.replace(/^\+/, '');

    let localNumber = clean;

    if (clean.startsWith(dialingCode)) {
      localNumber = clean.substring(dialingCode.length);
    }

    const regex = new RegExp(`^[0-9]{${maxDigits}}$`);

    return regex.test(localNumber);
  }

  public getPhoneNumberWithDialingCode(
    phone: string,
    country?: ICountry,
  ): string {
    let dialingCode = country?.dialingCode || this.defaultDialingCode;

    // Remove '+' if present
    dialingCode = dialingCode.replace(/^\+/, '');

    // Remove all non-digit characters (e.g., spaces, +, -, etc.)
    phone = phone.replace(/\D/g, '');

    // If it already starts with the dialing code (e.g., 234), return as-is
    if (phone.startsWith(dialingCode)) {
      return phone;
    }

    // If it starts with '0', remove it and prepend the dialing code
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }

    return dialingCode + phone;
  }

  public getPhoneNumberWithoutDialingCode(
    phone: string,
    country?: ICountry,
  ): string {
    let dialingCode = country?.dialingCode || this.defaultDialingCode;

    // Remove '+' if present
    dialingCode = dialingCode.replace(/^\+/, '');

    phone = phone.replace(/\D/g, '');

    if (phone.startsWith(dialingCode)) {
      phone = '0' + phone.substring(dialingCode.length);
    }

    return phone;
  }
}
