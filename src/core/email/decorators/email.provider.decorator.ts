import { SetMetadata } from '@nestjs/common';

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';

export const EmailProvider = (name: string) =>
  SetMetadata(EMAIL_PROVIDER, name);
