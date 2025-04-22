import { NestFactory } from '@nestjs/core';
import { AppModule } from './apiGateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log('API Gateway is running on port 3000');
}
bootstrap();
