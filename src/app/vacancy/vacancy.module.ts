import { forwardRef, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { FiltersModule } from '@app/filters/filters.module';
import { UsersModule } from '@app/users/users.module';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { VacancyEntity, VacancySchema } from './entities/vacancy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VacancyEntity.name,
        schema: VacancySchema,
      },
    ]),
    FiltersModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
  exports: [VacancyService],
})
export class VacancyModule {}
