import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { vacancyMapper } from './mapper';
import { IVacancy } from './interfaces/vacancy.interface';
import { DeleteResult } from 'mongodb';
import { IRemoveVacancy } from './interfaces/remove-vacancy.interface';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name)
    private readonly vacancyModel: Model<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<IVacancy> {
    try {
      return (await this.vacancyModel.create(vacancyMapper(createVacancyDto))) as IVacancy;
    } catch (err) {
      throw new InternalServerErrorException(`Внутренняя ошибка сервера: ${(err as Error).message}`);
    }
  }

  async findAll(): Promise<IVacancy[]> {
    try {
      const vacancies = await this.vacancyModel.find().exec();

      if (!vacancies.length) {
        throw new EntityNotFoundError(`Вакансии не неайдены!`);
      }

      return vacancies as IVacancy[];
    } catch (err) {
      throw new EntityNotFoundError(`Вакансии не неайдены!`);
    }
  }

  async findAllByUserId({ userId }: { userId: string }): Promise<IVacancy[]> {
    try {
      const vacancies = await this.vacancyModel
        .find({ author: userId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancies.length) {
        throw new EntityNotFoundError(`Вакансии пользователя с ${userId} не найдены!`);
      }

      return vacancies as IVacancy[];
    } catch (err) {
      throw new EntityNotFoundError(`Вакансии пользователя с ${userId} не найдены!`);
    }
  }

  async findByUserId(params: { userId: string; id: string }): Promise<IVacancy> {
    try {
      const vacancy = await this.vacancyModel
        .findOne({ ...params })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия с ${params.id} не найдена!`);
      }

      console.log('Vacancy found:', vacancy);

      return vacancy as IVacancy;
    } catch (err) {
      throw new EntityNotFoundError(`Вакансия с ${params.id} не найдена!`);
    }
  }

  async update(userId: string, id: string, updateVacancyDto: UpdateVacancyDto): Promise<IVacancy> {
    try {
      const vacancy = await this.vacancyModel.findOne({ authorId: userId, id });

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия с ${id} не найдена!`);
      }

      return (await vacancy
        .updateOne({ author: { _id: userId }, id }, { ...updateVacancyDto })
        .exec()) as IVacancy;
    } catch (err) {
      throw new InternalServerErrorException(`Внутренняя ошибка сервера: ${(err as Error).message}`);
    }
  }

  async remove(userId: string, id: string): Promise<IRemoveVacancy> {
    try {
      const deletedVacancy = await this.vacancyModel.findOneAndDelete({ authorId: userId, id });

      if (!deletedVacancy) {
        throw new EntityNotFoundError(`Вакансия с ${id} не найдена!`);
      }
     
      return { acknowledged: true, deletedCount: 1, removed: deletedVacancy as IVacancy };
    } catch (err) {
      throw err
    }
  }
}
