import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';
import { vacancyMapper } from './mapper';

import { Vacancy } from './entities/vacancy.entity';
import { IVacancy } from './interfaces/vacancy.interface';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { UsersService } from '../users/users.service';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name) private readonly vacancyModel: Model<Vacancy>,
    private readonly usersService: UsersService,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<IVacancy> {
    try {
      return (await this.vacancyModel.create(vacancyMapper(createVacancyDto))) as IVacancy;
    } catch (err) {
      console.error(`Ошибка при создании вакансии: ${(err as Error).message}`);
      throw new InternalServerErrorException('Внутренняя ошибка сервера');
    }
  }

  async findAll(): Promise<IVacancy[]> {
    try {
      const vacancies = await this.vacancyModel.find().exec();

      if (!vacancies.length) {
        return [];
      }

      return vacancies as IVacancy[];
    } catch (err) {
      console.error(`Ошибка при поиске вакансий: ${(err as Error).message}`);
      throw new InternalServerErrorException('Вакансии не найдены!');
    }
  }

  async findAllByUserId(params: IFindAllVacancyParams): Promise<IVacancy[]> {
    try {
      const { userId } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const vacancies = await this.vacancyModel
        .find({ author: userId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancies.length) {
        return [];
      }

      return vacancies as IVacancy[];
    } catch (err) {
      console.error(`Ошибка при поиске вакансий пользователя: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByUserId(params: IFindOneVacancyParams): Promise<IVacancy> {
    try {
      const { userId, id } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const vacancy = await this.vacancyModel
        .findOne({ author: userId, id })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return vacancy as IVacancy;
    } catch (err) {
      console.error(`Ошибка при поиске вакансии по ID: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(userId: string, id: string, updateVacancyDto: UpdateVacancyDto): Promise<IVacancy> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const vacancy = await this.vacancyModel.findOne({ authorId: userId, id });
      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return (await vacancy.updateOne({ author: { _id: userId }, id }, { ...updateVacancyDto }).exec()) as IVacancy;
    } catch (err) {
      console.error(`Ошибка при обновлении вакансии: ${(err as Error).message}`);
      throw err;
    }
  }

  async remove(userId: string, id: string): Promise<IRemoveEntity<IVacancy>> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const deletedVacancy = await this.vacancyModel.findOneAndDelete({ authorId: userId, id });
      if (!deletedVacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return { acknowledged: true, deletedCount: 1, removed: deletedVacancy as IVacancy };
    } catch (err) {
      console.error(`Ошибка при удалении вакансии: ${(err as Error).message}`);
      throw err;
    }
  }
}
