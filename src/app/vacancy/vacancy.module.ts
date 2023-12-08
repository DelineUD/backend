import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { FiltersModule } from '@app/filters/filters.module';

import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { Vacancy, VacancySchema } from './entities/vacancy.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vacancy.name,
        schema: VacancySchema,
      },
    ]),
    UsersModule,
    FiltersModule,
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
