import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'niddify-nestjs-api',
  port: parseInt(process.env.PORT || '8890', 10),
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  saltOrRounds: parseInt(process.env.SALT_OR_ROUNDS || '10', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpTime: process.env.JWT_EXP_TIME || '30d',
  jwtRefreshExpTime: process.env.JWT_REFRESH_EXP || '60d',

  // The Super admin config validator
  adminEmail: process.env.SUPER_ADMIN_EMAIL_ADDRESS,
  adminFirstName: process.env.SUPER_ADMIN_FIRST_NAME,
  adminLastName: process.env.SUPER_ADMIN_LAST_NAME,
  adminPassword: process.env.SUPER_ADMIN_PASSWORD,
}));
