import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  googleApiUri: process.env.GOOGLE_API,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
}));
