import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { ISocialAuth } from './interfaces/social-auth.interface';
import { RegistryService } from '../../common/registry/registry.service';
import { SOCIAL_AUTH_PROVIDER } from './decorators/social-auth.decorator';

@Injectable()
export class SocialAuthRegistry extends RegistryService<ISocialAuth> {
  constructor(discoveryService: DiscoveryService, reflector: Reflector) {
    super(
      discoveryService,
      reflector,
      SOCIAL_AUTH_PROVIDER,
      (instance: ISocialAuth): instance is ISocialAuth =>
        typeof instance.getUserAccount === 'function',
    );
  }
}
