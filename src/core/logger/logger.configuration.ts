import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => ({
  context: process.env.LOGGER_CONTEXT || 'AppLogger',
}));
