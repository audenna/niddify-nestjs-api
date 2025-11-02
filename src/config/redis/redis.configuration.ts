import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  forwardPort: parseInt(process.env.REDIS_EXPOSED_PORT || '6280', 10),
  user: process.env.REDIS_USER_NAME,
  password: process.env.REDIS_PASSWORD,
}));
