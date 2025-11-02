import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    console.log('Health Check Ok...');
    return { status: 'ok' };
  }
}
