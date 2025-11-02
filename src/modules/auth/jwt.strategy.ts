import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/app/app.config.service';
import { AuthUser } from '../auth-user/models/auth.user.model';
import { AppLogger } from '../../core/logger/logger.service';
import { UserPresenceStatusEnum } from '../../common/enums';
import { AuthUserRepository } from '../auth-user/repositories/auth.user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authUserRepository: AuthUserRepository,
    private logger: AppLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
    });
    this.logger = logger.withContext(JwtStrategy.name);
  }

  async validate(payload: any): Promise<AuthUser | object> {
    const user: AuthUser | null =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.authUserRepository.findAuthUserWithProfileByType(+payload.sub);

    this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);

    if (!user) {
      throw new UnauthorizedException('Account not found.');
    }

    if (user.presenceStatus === UserPresenceStatusEnum.DEACTIVATED) {
      throw new UnauthorizedException('Account currently suspended.');
    }

    if (user.presenceStatus !== UserPresenceStatusEnum.ACTIVE) {
      throw new UnauthorizedException(
        'You do not have access to this resource',
      );
    }

    return user;
  }
}
