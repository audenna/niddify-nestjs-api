export interface RefreshTokenModelInterface {
  authUserId: number;
  token?: string | null;
  expiresAt?: Date;
  isRevoked?: boolean;
}
