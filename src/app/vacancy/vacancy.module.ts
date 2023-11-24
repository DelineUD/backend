import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { MongooseModule } from '@nestjs/mongoose';
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
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}