import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const protoPath = join(process.cwd(), 'proto/auth.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: protoPath,
        url: '0.0.0.0:50052', // Cambiado a 50052 para evitar conflicto de puertos
      },
    },
  );
  await app.listen();
  console.log('Auth microservice is running on port 50052');
  console.log(`Using proto file at: ${protoPath}`);
}
bootstrap();
