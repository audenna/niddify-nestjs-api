import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { EmailProviderInterface } from '../interfaces/email.provider.interface';
import { RegistryService } from '../../../../common/registry/registry.service';
import { EMAIL_PROVIDER } from '../../decorators/email.provider.decorator';

@Injectable()
export class EmailProviderRegistry extends RegistryService<EmailProviderInterface> {
  constructor(discoveryService: DiscoveryService, reflector: Reflector) {
    super(
      discoveryService,
      reflector,
      EMAIL_PROVIDER,
      (instance: EmailProviderInterface): instance is EmailProviderInterface =>
        typeof instance.sendTemplateEmail === 'function' && instance.isActive,
    );
  }
}
