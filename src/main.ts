import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Explicitly tell Nest to use the Express platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Body parsers with increased limit
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields
      forbidNonWhitelisted: true, // throw error if extra fields exist
      transform: true, // automatically transform payloads into DTO instances
    }),
  );

  // Enable CORS globally
  app.enableCors({
    origin: '*', // allow all origins (change in production)
  });

  // Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Prisma shutdown hooks (so Prisma disconnects gracefully)
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port = 4000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}

bootstrap();
