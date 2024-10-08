import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { FilterQuery, Model, Types } from 'mongoose';

import { FiltersService } from '@app/filters/filters.service';
import { ResumeFindQueryDto } from './dto/resume-find-query.dto';
import { ResumeCreateDto } from './dto/resume-create.dto';
import { FilterKeys } from '@app/filters/consts';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { IResumeFindAll, IResumeFindOne } from './interfaces/resume-find.interface';
import { ResumeEntity } from './entities/resume.entity';
import { IResumeListResponse, IResumeResponse } from './interfaces/resume.interface';
import { resumeListMapper, resumeMapper } from './mappers/resume.mapper';
import { UpdateFiltersDto } from '@app/filters/dto/update-filters.dto';
import { resumeFiltersMapper } from './mappers/resume-filters.mapper';
import { ResumeUpdateDto } from './dto/resume-update.dto';

const logger = new Logger('Resumes');

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(ResumeEntity.name) private readonly resumeModel: Model<ResumeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async create(userId: Types.ObjectId, dto: ResumeCreateDto): Promise<IResumeResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const { _id: resumeId, authorId } = await this.resumeModel.create({ ...dto, authorId: _id });
      logger.log(`Resume successfully created!`);

      const resume = await this.resumeModel
        .findOne({ _id: resumeId, authorId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!resume) throw new EntityNotFoundError('Резюме не найдено!');

      const updateFilters: UpdateFiltersDto = {
        [FilterKeys.City]: dto.city,
        [FilterKeys.Spec]: dto.specialization ? [dto.specialization] : [],
        [FilterKeys.Programs]: dto.programs ?? [],
      };
      await this.filtersService.update(updateFilters).then(() => logger.log(`Filters successfully updated!`));

      return resumeMapper(resume, {
        _id,
        bun_info,
      });
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(userId: Types.ObjectId, resumeId: string, dto: ResumeUpdateDto): Promise<IResumeResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const result = await this.resumeModel
        .updateOne(
          {
            _id: new Types.ObjectId(resumeId),
            authorId: _id,
          },
          dto,
        )
        .exec();

      const resume = await this.resumeModel
        .findOne({ _id: resumeId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!result || !resume) {
        throw new EntityNotFoundError('Резюме не найдено!');
      }

      if (String(_id) !== String(resume.authorId)) {
        throw new EntityNotFoundError('Нет доступа!');
      }

      return resumeMapper(resume, {
        _id,
        bun_info,
      });
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(userId: Types.ObjectId, { desc, ...queryParams }: ResumeFindQueryDto): Promise<IResumeListResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: userId });

      const query: FilterQuery<Partial<ResumeFindQueryDto>> = await resumeFiltersMapper(
        this.filtersService,
        queryParams,
      );
      query.authorId = { $ne: _id };

      const resumes = await this.resumeModel
        .find(query)
        .populate('author', '_id first_name last_name avatar')
        .sort(desc ? { createdAt: -1 } : { createdAt: 1 })
        .exec();

      return resumeListMapper(resumes, { _id, bun_info });
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAllByUserId(
    { userId }: IResumeFindAll,
    { desc }: { desc: string | undefined },
  ): Promise<IResumeListResponse> {
    try {
      const { _id, bun_info } = await this.usersService.findOne({ _id: new Types.ObjectId(userId) });

      const resumes = await this.resumeModel
        .find({ authorId: _id })
        .populate('author', '_id first_name last_name avatar')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      return resumeListMapper(resumes, { _id, bun_info });
    } catch (err) {
      logger.error(`Error while findAllByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById({ userId, id }: IResumeFindOne): Promise<IResumeResponse> {
    try {
      const userInDb = await this.usersService.findOne({ _id: new Types.ObjectId(userId) });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден!');
      }

      const resumeInDb = await this.resumeModel
        .findOne({ _id: new Types.ObjectId(id) })
        .populate('author', '_id first_name last_name avatar bun_info')
        .exec();

      if (!resumeInDb) {
        throw new EntityNotFoundError('Резюме не найдено!');
      }

      return resumeMapper(resumeInDb, { _id: userInDb._id, bun_info: userInDb.bun_info });
    } catch (err) {
      logger.error(`Error while findOneById: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteOneById(userId: Types.ObjectId, resumeId: string): Promise<DeleteResult> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });

      const resumeInDb = await this.resumeModel.findOne({ _id: new Types.ObjectId(resumeId) }).exec();

      if (!resumeInDb) {
        throw new EntityNotFoundError('Резюме не найдено!');
      }

      if (String(userInDb._id) !== String(resumeInDb.authorId)) {
        throw new BadRequestException('Нет доступа!');
      }

      await this.resumeModel.deleteOne({ _id: resumeInDb._id, authorId: userInDb._id }).exec();
      logger.log('Resume successfully deleted!');

      return;
    } catch (err) {
      logger.error(`Error while deleteOneById: ${(err as Error).message}`);
      throw err;
    }
  }
}
