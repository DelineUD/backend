import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';
import { vacancyMapper } from './mapper';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name)
    private readonly vacancyModel: Model<Vacancy>,
  ) {}

  create(createVacancyDto: CreateVacancyDto) {
    return this.vacancyModel.create(vacancyMapper(createVacancyDto));
  }

  findAll() {
    return `This action returns all vacancy`;
  }

  update(id: string, updateVacancyDto: UpdateVacancyDto) {
    return `This action updates a #${id} vacancy`;
  }

  remove(id: string) {
    return `This action removes a #${id} vacancy`;
  }
}
