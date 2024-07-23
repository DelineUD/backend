import { forwardRef, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { DeleteResult } from 'mongodb';

import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { vacancyDtoMapper, vacancyListMapper, vacancyMapper } from '@app/vacancy/vacancy.mapper';
import { ICrudVacancyParams } from '@app/vacancy/interfaces/crud-vacancy.interface';
import { FiltersService } from '@app/filters/filters.service';
import { IDeleteVacancyQuery } from '@app/vacancy/interfaces/delete-vacancy.interface';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';
import { IResume } from '@app/resumes/interfaces/resume.interface';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import normalizeDto from '@utils/normalizeDto';
import { getMainFilters } from '@helpers/getMainFilters';
import { Vacancy } from './entities/vacancy.entity';
import { UsersService } from '../users/users.service';
import { IVacancy, IVacancyResponse } from './interfaces/vacancy.interface';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';

const logger = new Logger('Vacancies');

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name) private readonly vacancyModel: Model<Vacancy>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async update({ id, ...vacancyParams }: ICrudVacancyParams): Promise<IVacancy | IVacancy[]> {
    try {
      const userInDb = await this.usersService.findOne({ id });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const dto = vacancyParams as Partial<VacancyDto>;
      const normalizedDto = normalizeDto(dto, '_vacancy') as VacancyDto[];
      const vacancyMapped = normalizedDto.map((v) => {
        return vacancyDtoMapper({ authorId: userInDb._id, ...v });
      });

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
    { desc, format, ...queryParams }: VacancyFindQueryDto,
  ): Promise<IVacancyResponse[]> {
    try {
      const query: FilterQuery<Partial<IVacancy>> = await getMainFilters(this.filtersService, queryParams);
      format && (query.format = format);

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const vacancies = await this.vacancyModel
        .find(query)
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

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
        .populate('author', '_id first_name last_name avatar telegram city')
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
        .findOne({ authorId: userInDb._id, _id: id })
        .populate('author', '_id first_name last_name avatar telegram city')
        .exec();

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return vacancyMapper(vacancy, { _id: userInDb._id, blocked_users: userInDb.blocked_users });
    } catch (err) {
      logger.error(`Error while findByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteOneById(userId: Types.ObjectId, id: Types.ObjectId): Promise<DeleteResult> {
    try {
      const deletedVacancy = await this.vacancyModel
        .findOneAndDelete({
          authorId: new Types.ObjectId(userId),
          _id: id,
        })
        .exec();

      if (!deletedVacancy) {
        throw new EntityNotFoundError('Запись не найдена');
      }

      logger.log('Vacancy successfully deleted!');

      return {
        acknowledged: true,
        deletedCount: 1,
      };
    } catch (err) {
      logger.error(`Error while deleteOneById: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteAll(userId: Types.ObjectId, where: Partial<IResume>): Promise<DeleteResult> {
    try {
      const result = await this.vacancyModel.deleteMany({ ...where, authorId: userId });
      if (!result) {
        throw new EntityNotFoundError('Ошибка при удалении вакансий');
      }

      logger.log('Vacancies successfully deleted!');

      return result;
    } catch (err) {
      logger.error(`Error while deleteAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteByGetCoursePayload(query: IDeleteVacancyQuery): Promise<DeleteResult> {
    try {
      const dto = query as Partial<IVacancy>;
      const normalizedQueries = normalizeDto(dto, '_vacancy') as Partial<IVacancy>;

      const result = await this.vacancyModel.deleteMany({ ...normalizedQueries });
      if (!result) {
        throw new EntityNotFoundError('Ошибка при удалении вакансий');
      }

      logger.log('Vacancies successfully deleted!');

      return result;
    } catch (err) {
      logger.error(`Error while deleteByGetCoursePayload: ${(err as Error).message}`);
      throw err;
    }
  }
}
