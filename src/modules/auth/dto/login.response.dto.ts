import { Model } from 'sequelize-typescript';

export class LoginResponseDto<T extends Model> {
  accessToken: string;
  refreshToken: string;
  account: T | null;
}
