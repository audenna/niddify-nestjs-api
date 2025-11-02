import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  forwardPort: parseInt(process.env.FORWARD_DB_PORT || '3305', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  sync: process.env.DB_SYNC === 'true',
}));
