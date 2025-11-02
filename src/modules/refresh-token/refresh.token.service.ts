import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../core/logger/logger.service';
import { RefreshTokenRepository } from './repositories/refresh.token.repository';
import { Op } from 'sequelize';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly logger: AppLogger,
    private repo: RefreshTokenRepository,
  ) {
    this.logger = logger.withContext(RefreshTokenService.name);
  }

  async saveRefreshToken(
    authUserId: number,
    refreshToken: string,
    expiresAt: string,
  ): Promise<void> {
    this.logger.log('Saving new refresh token...');
    await Promise.all([
      this.repo.updateByCondition(
        { authUserId, isRevoked: false },
        { isRevoked: true },
      ),
      this.repo.create({
        authUserId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + this._parseExpires(expiresAt)),
        isRevoked: false,
      }),
    ]);
  }

  private _parseExpires(str: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = str.match(regex);
    if (!match) {
      throw new Error(`Invalid time format: ${str}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  async refresh(authUserId: number, refreshToken: string): Promise<boolean> {
    try {
      const stored = await this.repo.findOneByCondition({
        authUserId,
        token: refreshToken,
        isRevoked: 0,
        expiresAt: { [Op.gt]: new Date() },
      });
      this.logger.log('Refresh token found');
      this.logger.log(stored);

      if (!stored) return false;

      // Invalidate old refresh token
      await stored.update({ isRevoked: true });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
