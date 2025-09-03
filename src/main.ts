import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions-filter/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Habilita CORS
  app.enableCors({
    origin: '*', // ou ['http://localhost:3000', 'https://seusite.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
