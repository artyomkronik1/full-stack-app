import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // Correct import for helmet

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Helmet for setting various HTTP headers to secure your app
  app.use(helmet());

  // Configure CORS if your frontend is on a different origin
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true, // If you need to send cookies or authorization headers
  });

  // Optionally configure global prefix
  // app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
