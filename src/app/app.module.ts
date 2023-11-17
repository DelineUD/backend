import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { getMongoConfig } from '../config/db-connect.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ResidentsModule } from './residents/residents.module';
import { NotFoundInterceptor } from './shared/interceptors/not-found.interceptor';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { EventsModule } from './events/events.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./envs/.backend.env', './envs/.development.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    MulterModule.register({
      dest: './files',
    }),
    AuthModule,
    ResidentsModule,
    PostsModule,
    UploadModule,
    EventsModule,
    FiltersModule,
  ],
  controllers: [AppController, FiltersController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
    UploadService,
  ],
})
export class AppModule {}
