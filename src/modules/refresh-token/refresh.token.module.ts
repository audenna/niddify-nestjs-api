import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh.token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.token.model';
import { RefreshTokenRepository } from './repositories/refresh.token.repository';

@Module({
  imports: [SequelizeModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository],
})
export class RefreshTokenModule {}
