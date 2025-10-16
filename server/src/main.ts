import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session'


declare module 'express-session' {
  interface SessionData {
    admin?: {
      id: string,
      username: string
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
