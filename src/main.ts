import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import path from 'node:path';
import { existsSync } from 'fs';

import hbs from 'hbs';
import { AppConfigService } from './config/app/app.config.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CursorPaginationMiddleware } from './common/middleware/cursor-pagination.middleware';
import { AuditLogInterceptor } from './core/audit-log/interceptors/audit-log.interceptor';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
      bodyParser: true,
      cors: true,
      snapshot: true,
    });

  // Set the default API path
  app.setGlobalPrefix('api/v1/');

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(new CursorPaginationMiddleware().use);
  app.useGlobalInterceptors(new AuditLogInterceptor());

  // Configure the Handler Bar files and folders
  app.set('views', path.join(process.cwd(), 'src/views'));
  const partialsPath = path.join(process.cwd(), 'src/views/partials');

  if (!existsSync(partialsPath)) {
    console.error('Partials directory does not exist:', partialsPath);
  } else {
    try {
      hbs.registerPartials(partialsPath);
    } catch (err) {
      console.error('Failed to register partials:', err);
    }
  }

  // allow NestJs to see all files in the public folder
  app.useStaticAssets(path.join(__dirname, 'public'));
  app.setViewEngine('hbs');

  const appConfigService: AppConfigService = app.get(AppConfigService);
  const port: number = +appConfigService.port || 3000;

  await app.listen(port, `${appConfigService.host}`, () =>
    console.log(`${appConfigService.name} is listening on port: ${port}`),
  );

  app.enableShutdownHooks();
}

void bootstrap();
