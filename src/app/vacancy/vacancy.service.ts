import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { ICrudVacancyParams } from '@app/vacancy/interfaces/crud-vacancy.interface';
import { vacancyDtoMapper, vacancyListMapper, vacancyMapper } from '@app/vacancy/vacancy.mapper';
import normalizeDto from '@utils/normalizeDto';

import { Vacancy } from './entities/vacancy.entity';
import { IVacancy, IVacancyResponse } from './interfaces/vacancy.interface';
import { UsersService } from '../users/users.service';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';
import { FiltersService } from '@app/filters/filters.service';
import { getMainFilters } from '@helpers/getMainFilters';

const logger = new Logger('Vacancies');

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name) private readonly vacancyModel: Model<Vacancy>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async update({ id, ...vacancyParams }: ICrudVacancyParams): Promise<IVacancy | IVacancy[]> {
    try {
      const userInDb = await this.usersService.findOne({ id });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const dto = { authorId: userInDb._id, ...vacancyParams } as unknown as VacancyDto;
      const normalizedDto = normalizeDto(dto, '_vacancy') as VacancyDto[];
      const vacancyMapped = normalizedDto.map((r) => vacancyDtoMapper(r));

      await Promise.all([
        await this.vacancyModel.deleteMany({ authorId: userInDb._id }),
        await this.vacancyModel.create(...vacancyMapped),
      ]);

      logger.log(`Vacancies successfully created!`);

      return await this.vacancyModel.find({ authorId: userInDb._id });
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw new InternalServerErrorException(`Ошибка при обновлении вакансий: "${err.message}!"`);
    }
  }

  async findAll(
    userId: Types.ObjectId,
    { desc, remote_work, ...queryParams }: VacancyFindQueryDto,
  ): Promise<IVacancyResponse[]> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const query: FilterQuery<Partial<IVacancy>> = await getMainFilters(this.filtersService, queryParams);
      remote_work && (query.remote_work = remote_work);

      const vacancies = await this.vacancyModel
        .find(query)
        .populate('author', '_id first_name last_name avatar telegram qualification blocked_users')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      if (!vacancies.length) {
        return [];
      }

      return vacancyListMapper(vacancies, { _id: userInDb._id, blocked_users: userInDb.blocked_users });
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw new InternalServerErrorException('Ошибка при поиске вакансий!');
    }
  }

  async findAllByUserId(params: IFindAllVacancyParams, query: VacancyFindQueryDto): Promise<IVacancyResponse[]> {
    try {
      const { userId } = params;
      const { desc } = query;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const vacancies = await this.vacancyModel
        .find({ authorId: userInDb._id })
        .populate('author', '_id first_name last_name avatar telegram city blocked_users')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      if (!vacancies.length) {
        return [];
      }

      return vacancyListMapper(vacancies, { _id: userId._id, blocked_users: userInDb.blocked_users });
    } catch (err) {
      logger.error(`Error while findAllByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async findByUserId(params: IFindOneVacancyParams): Promise<IVacancyResponse> {
    try {
      const { userId, id } = params;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const vacancy = await this.vacancyModel
        .findOne({ authorId: userInDb._id, id: id })
        .populate('author', '_id first_name last_name avatar telegram city blocked_users')
        .exec();

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return vacancyMapper(vacancy, { _id: userId._id, blocked_users: userInDb.blocked_users });
    } catch (err) {
      logger.error(`Error while findByUserId: ${(err as Error).message}`);
      throw err;
    }
  }
}
