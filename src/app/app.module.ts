import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NotFoundInterceptor } from '@shared/interceptors/not-found.interceptor';
import { AppVersionInterceptor } from '@shared/interceptors/app-version.interceptor';
import { getMongoConfig } from '@/config/db-connect.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ResidentsModule } from './residents/residents.module';
import { EventsModule } from './events/events.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersModule } from './filters/filters.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ResumesModule } from './resumes/resumes.module';
import { ComplaintsModule } from '@app/complaints/complaints.module';
import { MigrationModule } from './migration/migration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./envs/.backend.env', `./.${process.env.NODE_ENV}.env`],
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
    FiltersModule,
    ResidentsModule,
    PostsModule,
    EventsModule,
    VacancyModule,
    ResumesModule,
    ComplaintsModule,
    MigrationModule,
  ],
  controllers: [AppController, FiltersController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppVersionInterceptor,
    },
  ],
})
export class AppModule {}
