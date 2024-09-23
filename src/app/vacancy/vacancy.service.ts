import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { FilterQuery, Model, Types } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { VacancyFindQueryDto } from '@app/vacancy/dto/vacancy-find-query.dto';
import { VacancyCreateDto } from '@app/vacancy/dto/vacancy-create.dto';
import { FilterKeys } from '@app/filters/consts';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { IVacancyFindAll, IVacancyFindOne } from './interfaces/vacancy-find.interface';
import { VacancyEntity } from './entities/vacancy.entity';
import { IVacancyListResponse, IVacancyResponse } from './interfaces/vacancy.interface';
import { vacancyListMapper, vacancyMapper } from './mappers/vacancy.mapper';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { vacancyFiltersMapper } from '@app/vacancy/mappers/vacancy-filters.mapper';
import { VacancyUpdateDto } from '@app/vacancy/dto/vacancy-update.dto';

const logger = new Logger('Vacancies');

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(VacancyEntity.name) private readonly vacancyModel: Model<VacancyEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async create(userId: Types.ObjectId, dto: VacancyCreateDto): Promise<IVacancyResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const { _id: vacancyId, authorId } = await this.vacancyModel.create({ ...dto, authorId: _id });
      logger.log(`Vacancies successfully created!`);

      const vacancy = await this.vacancyModel
        .findOne({ _id: vacancyId, authorId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancy) throw new EntityNotFoundError('Вакансия не найдена!');

      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.City]: dto.city,
        [FilterKeys.Spec]: dto.specializations ?? [],
        [FilterKeys.Programs]: dto.programs ?? [],
      };
      await this.filtersService.update(updateFilters).then(() => logger.log(`Filters successfully updated!`));

      return vacancyMapper(vacancy, {
        _id,
        bun_info,
      });
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(userId: Types.ObjectId, vacancyId: string, dto: VacancyUpdateDto): Promise<IVacancyResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const result = await this.vacancyModel
        .updateOne(
          {
            _id: new Types.ObjectId(vacancyId),
            authorId: _id,
          },
          dto,
        )
        .exec();

      const vacancy = await this.vacancyModel
        .findOne({ _id: vacancyId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!result || !vacancy) {
        throw new EntityNotFoundError('Вакансия не найдена!');
      }

      if (String(_id) !== String(vacancy.authorId)) {
        throw new EntityNotFoundError('Нет доступа!');
      }

      return vacancyMapper(vacancy, {
        _id,
        bun_info,
      });
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(
    userId: Types.ObjectId,
    { desc, ...queryParams }: VacancyFindQueryDto,
  ): Promise<IVacancyListResponse[]> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const query: FilterQuery<Partial<VacancyFindQueryDto>> = await vacancyFiltersMapper(
        this.filtersService,
        queryParams,
      );

      const vacancies = await this.vacancyModel
        .find(query)
        .populate('author', '_id first_name last_name avatar')
        .sort(desc ? { createdAt: -1 } : { createdAt: 1 })
        .exec();

      return vacancyListMapper(vacancies, { _id, bun_info });
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllByUserId(
    { userId }: IVacancyFindAll,
    { desc }: { desc: string | undefined },
  ): Promise<IVacancyListResponse[]> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: new Types.ObjectId(userId) });

      const vacancies = await this.vacancyModel
        .find({ authorId: _id })
        .populate('author', '_id first_name last_name avatar')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      return vacancyListMapper(vacancies, { _id, bun_info });
    } catch (err) {
      logger.error(`Error while findAllByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById({ userId, id }: IVacancyFindOne): Promise<IVacancyResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: new Types.ObjectId(userId) });

      const vacancyInDb = await this.vacancyModel
        .findOne({ _id: new Types.ObjectId(id) })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!vacancyInDb) {
        throw new EntityNotFoundError('Вакансия не найдена!');
      }

      return vacancyMapper(vacancyInDb, { _id, bun_info });
    } catch (err) {
      logger.error(`Error while findByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteOneById(userId: Types.ObjectId, vacancyId: string): Promise<DeleteResult> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });

      const vacancyInDb = await this.vacancyModel.findOne({ _id: new Types.ObjectId(vacancyId) }).exec();

      if (!vacancyInDb) {
        throw new EntityNotFoundError('Вакансия не найдена!');
      }

      if (String(userInDb._id) !== String(vacancyInDb.authorId)) {
        throw new BadRequestException('Нет доступа!');
      }

      await this.vacancyModel.deleteOne({ _id: vacancyInDb._id, authorId: userInDb._id }).exec();
      logger.log('Vacancy successfully deleted!');

      return;
    } catch (err) {
      logger.error(`Error while deleteOneById: ${(err as Error).message}`);
      throw err;
    }
  }
}
