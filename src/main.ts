import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 import this
import { json, urlencoded } from 'express';

async function bootstrap() {
  // 👇 explicitly tell Nest to use the Express platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true }));

  app.enableCors({
    origin: ['http://localhost:5500', 'http://localhost:3000'],
  });

  // ✅ now this will work:
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port =  4000;
  await app.listen(port);
  console.log(` Server running on http://localhost:${port}`);
}
bootstrap();
