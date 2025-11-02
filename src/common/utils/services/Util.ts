import { BadRequestException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class Util {
  sanitizeString(value: string): string {
    return value.trim();
  }

  getDayFromDate(date: Date): string {
    return dayjs(date).format('dddd');
  }

  /**
   * Example Usage
   * console.log(Util.creatAliasFrommName("Best of Round! ")); // "best-of-round"
   * console.log(Util.creatAliasFrommName("Best @ Month 2024")); // "best-month-2024"
   * console.log(Util.creatAliasFrommName(" Special Badge ")); // "special-badge"
   * @param name
   * @returns {string}
   */
  createAlias(name: string): string {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, ''); // Remove hyphen at start or end
  }

  /**
   * Example output is: "a4f1d3e2"
   *
   * @param length
   * @param existingCodes
   * @returns {string}
   */
  generateRandomReferralCode(
    length = 10,
    existingCodes: string[] = [],
  ): string {
    let newCode: string;

    do {
      newCode = crypto.randomBytes(length).toString('hex').slice(0, length);
    } while (existingCodes.includes(newCode));

    return newCode;
  }

  capitalizeFirstLetters(str: string): string {
    str = str.trim();
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  convertToLowercase(str: string): string {
    return str.toLowerCase();
  }

  generateOTP(otps: any[] = [], totalNumber: number = 6): string {
    const digits = '0123456789';
    let OTP = '';

    do {
      OTP = '';
      for (let i = 0; i < totalNumber; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
    } while (otps.includes(OTP));

    return OTP;
  }

  /**
   * Generates a unique lowercase payment reference.
   * Ensures it's not in the provided list of existing references.
   * Example: deposit_20250608_e7f3a6bd
   */
  generatePaymentReference(
    prefix: string,
    references: (string | null)[] = [],
  ): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    let reference: string;
    let attempts = 0;

    do {
      const randomPart = crypto.randomBytes(4).toString('hex'); // e.g., "a7b3d9fc"
      reference = `${prefix.toLowerCase()}_${date}_${randomPart}`;
      attempts++;

      if (attempts > 5) {
        throw new Error('Unable to generate unique reference');
      }
    } while (references.includes(reference));

    return reference;
  }

  generateAmountToStake(minAmount: number = 0, maxAmount: number = 0): number {
    minAmount = Math.floor(minAmount);
    maxAmount = Math.floor(maxAmount);

    if (minAmount > maxAmount || maxAmount === 0) {
      return minAmount;
    }

    return Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
  }

  generateUniqueUuid(existingUuids: string[]): string {
    let newUuid: string;

    do {
      newUuid = uuidv4();
    } while (existingUuids.includes(newUuid));

    return newUuid;
  }

  ensureAtLeastOneFieldProvided(payload: Record<string, any>): void {
    const hasValidField = Object.values(payload).some(
      (v) => v !== undefined && v !== null && v !== '',
    );

    if (!hasValidField) {
      throw new BadRequestException('At least one field must be provided.');
    }
  }

  stripEmptyFields(payload: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
  }

  convertToNumberArray(values?: any[]): number[] {
    if (!values) return [];
    return values.map((v) => Number(v)).filter((v) => !isNaN(v));
  }

  /**
   * Compute percentage difference with + or - sign
   */
  computeValueChange(current: number, previous: number): string {
    if (!previous || previous === 0) {
      return '+0%';
    }

    const rawChange = ((current - previous) / previous) * 100;

    const sign = rawChange >= 0 ? '+' : '';
    return `${sign}${rawChange.toFixed(2)}%`;
  }
}
