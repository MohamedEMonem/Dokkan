import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Configure Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not exist in the DTO
      forbidNonWhitelisted: true, // Optional: Throws error if extra props are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // 3. Register the Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 4. Configure CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Allow Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
