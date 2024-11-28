import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // Configura el prefijo /api antes de cualquier endpóint

  app.useGlobalPipes(
    new ValidationPipe({// Configura las validaciones en cada endpoint que cuente con DTO
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
