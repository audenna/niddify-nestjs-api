import { Global, Module } from '@nestjs/common';
import { Util, DateUtil, HashUtil, PhoneUtil } from './';
import { IsPhoneNumberValid } from '../validators';

@Global()
@Module({
  providers: [HashUtil, DateUtil, Util, PhoneUtil, IsPhoneNumberValid],
  exports: [HashUtil, DateUtil, Util, PhoneUtil, IsPhoneNumberValid],
})
export class UtilsModule {}
