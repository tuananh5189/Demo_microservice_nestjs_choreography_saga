import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@rabbitmq:5672'],
        queue: 'inventory_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Create HTTP app for Swagger
  const httpApp = await NestFactory.create(AppModule);
  
  // Enable CORS
  httpApp.enableCors();
  
  // Enable validation
  httpApp.useGlobalPipes(new ValidationPipe());
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setDescription('The Inventory Service API description')
    .setVersion('1.0')
    .addTag('inventory')
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api', httpApp, document);

  await Promise.all([
    app.listen(),
    httpApp.listen(3002),
  ]);
  console.log('Inventory service is running');
}
bootstrap(); 