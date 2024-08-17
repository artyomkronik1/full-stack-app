import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if your frontend is on a different origin
  app.enableCors();


  await app.listen(3001);
}
bootstrap();
