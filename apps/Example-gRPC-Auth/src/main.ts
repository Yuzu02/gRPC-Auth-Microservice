import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthMicroservice');
  const protoPath = join(process.cwd(), 'proto/auth.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: protoPath,
        url: '0.0.0.0:50052', 
      },
    },
  );
  await app.listen();
  logger.log('Auth microservice is running on port 50052');
  logger.log(`Using proto file at: ${protoPath}`);
}
bootstrap();
