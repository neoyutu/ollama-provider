import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';
import { Logger } from '@nestjs/common';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);
  const port = appConfigService.port || 3000;
  app.enableCors();
  await app.listen(port);

  const logger = new Logger(AppService.name);
  logger.log(`Application is running on: http://:${port}`);
}

bootstrap();
