// validators/is-comma-separated.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  ValidateBy,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCommaSeparated(
  validatorFn?: (value: string) => boolean,
  validationOptions?: ValidationOptions,
) {
  return applyDecorators(
    Transform(({ value }) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      typeof value === 'string'
        ? value
            .split(',')
            .map((e: string) => e.trim())
            .filter((e: string) => e.length > 0)
        : value,
    ),
    validatorFn
      ? ValidateBy(
          {
            name: 'isCommaSeparated',
            validator: {
              validate: (values: any[], args: ValidationArguments) =>
                Array.isArray(values) && values.every((v) => validatorFn(v)),
              defaultMessage: (args: ValidationArguments) =>
                `${args.property} must contain only valid values`,
            },
          },
          validationOptions,
        )
      : (target: any, propertyName: string) => {}, // no-op
  );
}
