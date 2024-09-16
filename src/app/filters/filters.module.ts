import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { CitiesEntity, CitiesSchema } from '@app/filters/entities/cities.entity';
import { SpecializationsEntity, SpecializationSchema } from '@app/filters/entities/specializations.entity';
import { ProgramsEntity, ProgramsSchema } from '@app/filters/entities/programs.entity';
import { GroupsEntity, GroupsSchema } from '@app/filters/entities/groups.entity';
import { JobFormatsEntity, JobFormatsSchema } from '@app/filters/entities/job-formats.entity';
import { JobExperienceEntity, JobExperienceSchema } from '@app/filters/entities/job-experience.entity';
import {
  ProjectsInvolvementEntity,
  ProjectsInvolvementSchema,
} from '@app/filters/entities/projects-involvement.entity';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { Qualifications, QualificationsSchema } from '@app/filters/entities/qualifications.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CitiesEntity.name,
        schema: CitiesSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: SpecializationsEntity.name,
        schema: SpecializationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProgramsEntity.name,
        schema: ProgramsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Qualifications.name,
        schema: QualificationsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: GroupsEntity.name,
        schema: GroupsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: JobFormatsEntity.name,
        schema: JobFormatsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: JobExperienceEntity.name,
        schema: JobExperienceSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ProjectsInvolvementEntity.name,
        schema: ProjectsInvolvementSchema,
      },
    ]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService],
})
export class FiltersModule {}
