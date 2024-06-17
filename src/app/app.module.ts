import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NotFoundInterceptor } from '@shared/interceptors/not-found.interceptor';
import { getMongoConfig } from '@/config/db-connect.config';
import { ComplaintsModule } from '@app/complaints/complaints.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ResidentsModule } from './residents/residents.module';
import { EventsModule } from './events/events.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersModule } from './filters/filters.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ResumesModule } from './resumes/resumes.module';
import { MigrationModule } from './migration/migration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./envs/.backend.env', `./envs/.${process.env.NODE_ENV}.env`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
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
  ],
})
export class AppModule {}
