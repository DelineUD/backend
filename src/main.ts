import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.SERVER_PORT || 3000;
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
      requestInterceptor: (req: any) => {
        req.headers['app-version'] = '1.0.8';
        return req;
      },
    },
  };

  SwaggerModule.setup('api/docs', app, document, options);

  app.use(cookieParser());
  app.enableCors({
    origin: true,
  });
  app.use(`/${process.env.STATIC_PATH}`, express.static(process.env.STATIC_PATH_FOLDER));

  app.listen(port).then(() => `Server has been stared on ${port}`);
}

bootstrap().then(() => `Bootstrap successful`);
