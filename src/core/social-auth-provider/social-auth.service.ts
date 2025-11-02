import { AppLogger } from '../logger/logger.service';
import { SocialAuthPayloadDto } from './dto/social-auth-payload.dto';
import { SocialAuthRegistry } from './social-auth.registry';
import { SocialAuthResponseDto } from './dto/social-auth-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly registry: SocialAuthRegistry,
  ) {
    this.logger = logger.withContext(SocialAuthService.name);
  }

  async authenticateUser(
    payload: SocialAuthPayloadDto,
  ): Promise<SocialAuthResponseDto> {
    const provider = this.registry.getProvider(payload.provider);
    this.logger.log(
      `Contacting social auth provider: ${provider?.getProviderName()}...`,
    );

    if (!provider) throw new Error('Request failed. Try again later.');

    return provider.getUserAccount(payload.tokenType, payload.code);
  }
}
