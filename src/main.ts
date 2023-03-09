import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('UDM_API')
    .setDescription('UDM_back')
    .setVersion('1.0')
    .addTag('UDM')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'mockValue',
        },
      },
    },
  };

  SwaggerModule.setup('api/docs', app, document, options);

  app.enableCors({
    origin: [
      /** IOS Capacitor Application */
      'capacitor://localhost',
      /** Android Capacitor Application */
      'http://localhost',
    ],
  });

  await app.listen(3000);
}
bootstrap();
