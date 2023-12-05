import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Countries, CountriesSchema } from '@app/filters/entities/countries.entity';
import { Cities, CitiesSchema } from '@app/filters/entities/cities.entity';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { Specializations, SpecializationSchema } from '@app/filters/entities/specializations.entity';
import { NarrowSpecializations, NarrowSpecializationSchema } from '@app/filters/entities/narrow-specializations.entity';
import { Programs, ProgramsSchema } from '@app/filters/entities/programs.entity';
import { Courses, CoursesSchema } from '@app/filters/entities/courses.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Countries.name,
        schema: CountriesSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Cities.name,
        schema: CitiesSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Specializations.name,
        schema: SpecializationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: NarrowSpecializations.name,
        schema: NarrowSpecializationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Programs.name,
        schema: ProgramsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Courses.name,
        schema: CoursesSchema,
      },
    ]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService],
})
export class FiltersModule {}
