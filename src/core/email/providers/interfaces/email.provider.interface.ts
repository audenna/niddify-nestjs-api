import { EmailOptionsDto } from '../../dto/email.options.dto';

export interface EmailProviderInterface {
  name: string;
  isActive: boolean;
  sendTemplateEmail(emailOptionsDto: EmailOptionsDto): Promise<void>;
}
