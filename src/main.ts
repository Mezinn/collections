import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  config({ path: __dirname + '/../.env' });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
