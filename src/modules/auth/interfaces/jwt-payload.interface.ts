export interface JwtPayload {
  sub: number;
  username: string | undefined | null;
  role: string | undefined | null;
  iat?: number;
  exp?: number;
}

export interface jwtToken {
  accessToken: string;
  refreshToken: string;
}
