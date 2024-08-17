import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if your frontend is on a different origin
  app.enableCors({
    origin: 'https://full-stack-app-zza8.vercel.app', // Replace with your frontend URL
    credentials: true,
  });


  await app.listen(3001);
}
bootstrap();
