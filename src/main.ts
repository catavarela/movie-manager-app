import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function startSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Movie Manager')
    .setDescription('This is the documentation for the movie manager app.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  startSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();