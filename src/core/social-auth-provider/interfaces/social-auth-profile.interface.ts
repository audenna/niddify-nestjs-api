export interface IGoogleAuthProfile {
  iss?: string;
  nbf?: string;
  aud?: string;
  sub: string;
  email: string;
  email_verified: string | boolean;
  azp?: string;
  name?: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat?: string;
  exp?: string;
  alg?: string;
  kid?: string;
  typ?: string;
  locale?: string;
}
