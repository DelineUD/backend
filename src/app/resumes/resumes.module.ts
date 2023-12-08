import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Resume, ResumeSchema } from './entities/resume.entity';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { UsersModule } from '../users/users.module';
import { FiltersModule } from '@app/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Resume.name,
        schema: ResumeSchema,
      },
    ]),
    UsersModule,
    FiltersModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
