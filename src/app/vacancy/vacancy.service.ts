import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { VacancyDto } from '@app/vacancy/dto/vacancy.dto';
import { ICrudVacancyParams } from '@app/vacancy/interfaces/crud-vacancy.interface';
import { vacancyMapper } from '@app/vacancy/vacancy.mapper';
import normalizeDto from '@utils/normalizeDto';

import { Vacancy } from './entities/vacancy.entity';
import { IVacancy } from './interfaces/vacancy.interface';
import { UsersService } from '../users/users.service';
import { IFindAllVacancyParams, IFindOneVacancyParams } from './interfaces/find-vacancy.interface';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';
import { FiltersService } from '@app/filters/filters.service';
import { getMainFilters } from '@helpers/getMainFilters';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy.name) private readonly vacancyModel: Model<Vacancy>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async update(userId: Types.ObjectId, vacancyParams: ICrudVacancyParams): Promise<IVacancy | IVacancy[]> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const dto = { author: user._id, ...vacancyParams } as VacancyDto;
      const normalizedDto = normalizeDto(dto, '_vacancy') as VacancyDto[];
      const vacancyMapped = normalizedDto.map((r) => vacancyMapper(r));

      await Promise.all([
        await this.vacancyModel.deleteMany({ author: userId }),
        await this.vacancyModel.create(...vacancyMapped),
      ]);

      return this.vacancyModel.find({ ...vacancyMapped });
    } catch (err) {
      console.error(`Ошибка при обновлении вакансий: ${(err as Error).message}`);
      throw new InternalServerErrorException('Ошибка при обновлении вакансий!');
    }
  }

  async findAll({ desc, remote_work, ...queryParams }: VacancyFindQueryDto): Promise<IVacancy[]> {
    try {
      const query: FilterQuery<Partial<IVacancy>> = await getMainFilters(this.filtersService, queryParams);
      remote_work && (query.remote_work = remote_work);

      return await this.vacancyModel
        .find(query)
        .sort(typeof desc !== 'undefined' && { createdAt: -1 })
        .exec();
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

      return vacancies;
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
        .findOne({ author: user._id, _id: id })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancy) {
        throw new EntityNotFoundError(`Вакансия не найдена`);
      }

      return vacancy;
    } catch (err) {
      console.error(`Ошибка при поиске вакансии по ID: ${(err as Error).message}`);
      throw err;
    }
  }
}
