import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Resume, ResumeSchema } from './entities/resume.entity';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { UsersModule } from '../users/users.module';
import { FiltersModule } from '@app/filters/filters.module';
import { VacancyService } from '@app/vacancy/vacancy.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Resume.name,
        schema: ResumeSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    FiltersModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
