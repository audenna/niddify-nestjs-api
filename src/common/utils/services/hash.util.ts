import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../../config/app/app.config.service';

@Injectable()
export class HashUtil {
  constructor(private readonly appConfigService: AppConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = this.appConfigService.saltOrRounds;
    const salt = await bcrypt.genSalt(Number(saltOrRounds));
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    plainText: string,
    encryptedPassword: string | null | undefined,
  ): Promise<boolean> {
    if (!encryptedPassword) return false;
    return await bcrypt.compare(plainText, encryptedPassword);
  }
}
