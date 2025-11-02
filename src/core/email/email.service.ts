import { Injectable } from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';
import { EmailProviderRegistry } from './providers/registry/email.provider.registry';
import { EmailOptionsDto } from './dto/email.options.dto';
import { EmailProviderInterface } from './providers/interfaces/email.provider.interface';

@Injectable()
export class EmailService {
  private readonly defaultProvider: string = 'aws-ses';

  constructor(
    private readonly logger: AppLogger,
    private readonly registry: EmailProviderRegistry,
  ) {
    this.logger = logger.withContext(EmailService.name);
  }

  async handleEmailDispatch(
    emailOptionsDto: EmailOptionsDto,
    providerName?: string,
  ): Promise<any> {
    const provider = this.registry.getProvider(
      providerName ?? this.defaultProvider,
    );

    await provider?.sendTemplateEmail(emailOptionsDto);
  }
}
