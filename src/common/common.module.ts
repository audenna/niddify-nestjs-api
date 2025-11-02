import { Global, Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';

@Global()
@Module({
  imports: [UtilsModule],
  exports: [UtilsModule],
})
export class CommonModule {}
