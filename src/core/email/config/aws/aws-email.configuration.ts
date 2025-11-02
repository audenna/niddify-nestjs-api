import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('ses', () => ({
  awsRegion: process.env.AWS_REGION,
  sendFromEmail: process.env.EMAIL_SEND_FROM_EMAIL,
  sendFromName: process.env.EMAIL_SEND_FROM_NAME,
  sesAccessKeyId: process.env.SES_ACCESS_KEY_ID,
  sesSecretKey: process.env.SES_SECRET_KEY,
}));
