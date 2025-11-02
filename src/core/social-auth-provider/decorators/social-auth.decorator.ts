import { SetMetadata } from '@nestjs/common';

export const SOCIAL_AUTH_PROVIDER = 'SOCIAL_AUTH_PROVIDER';

export const SocialAuthProvider = (name: string) =>
  SetMetadata(SOCIAL_AUTH_PROVIDER, name);
