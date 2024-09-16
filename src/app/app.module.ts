import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { getMongoConfig } from '@/config/db-connect.config';
import { NotFoundInterceptor } from '@shared/interceptors/not-found.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profiles/profile.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { EventsModule } from './events/events.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersModule } from './filters/filters.module';
import { PostsModule } from './posts/posts.module';
import { ResumesModule } from './resumes/resumes.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { SeedModule } from './seed/seed.module';

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
    ProfileModule,
    FiltersModule,
    PostsModule,
    EventsModule,
    VacancyModule,
    ResumesModule,
    ComplaintsModule,
    SeedModule,
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
