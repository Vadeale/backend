import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { resolve } from 'node:path';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  const storageRoot = resolve(process.cwd(), process.env.STORAGE_ROOT ?? './storage');
  app.use('/storage', express.static(storageRoot));
  // Backward compatibility for historical paths with different casing.
  app.use('/storage/uploads', express.static(resolve(storageRoot, 'uploads')));
  app.use('/storage/uploads', express.static(resolve(storageRoot, 'Uploads')));
  app.use('/uploads', express.static(resolve(storageRoot, 'uploads')));
  app.use('/uploads', express.static(resolve(storageRoot, 'Uploads')));
  app.use('/Uploads', express.static(resolve(storageRoot, 'Uploads')));
  app.use('/Uploads', express.static(resolve(storageRoot, 'uploads')));
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
