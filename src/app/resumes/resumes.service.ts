import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import normalizeDto from '@utils/normalizeDto';
import { resumeDtoMapper, resumeListMapper, resumeMapper } from '@app/resumes/resume.mapper';
import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { ResumeDto } from '@app/resumes/dto/resume.dto';
import { Resume } from './entities/resume.entity';
import { IResume, IResumeResponse } from './interfaces/resume.interface';
import { UsersService } from '../users/users.service';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';
import { FiltersService } from '@app/filters/filters.service';
import { getMainFilters } from '@helpers/getMainFilters';

const logger = new Logger('Resumes');

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<Resume>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async update({ id, ...resumeParams }: ICrudResumeParams): Promise<IResume | IResume[]> {
    try {
      const userInDb = await this.usersService.findOne({ id });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const dto = { authorId: userInDb._id, ...resumeParams } as unknown as ResumeDto;
      const normalizedDto = normalizeDto(dto, '_resume') as ResumeDto[];

      const resumesMapped = normalizedDto.map((r) => resumeDtoMapper(r));

      await Promise.all([
        await this.resumeModel.deleteMany({ authorId: userInDb._id }),
        await this.resumeModel.create(...resumesMapped),
      ]);

      logger.log(`Resumes successfully created!`);

      return await this.resumeModel.find({ authorId: userInDb._id });
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
      throw new InternalServerErrorException(`Ошибка при обновлении резюме: "${err.message}!"`);
    }
  }

  async findAll({ remote_work, desc, ...queryParams }: ResumeFindQueryDto): Promise<IResumeResponse[]> {
    try {
      const query: FilterQuery<Partial<IResume>> = await getMainFilters(this.filtersService, queryParams);
      remote_work && (query.remote_work = remote_work);

      const resumes = await this.resumeModel
        .find(query)
        .populate('author', '_id first_name last_name avatar city telegram')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      return resumeListMapper(resumes);
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw new InternalServerErrorException('Ошибка при поиске резюме!');
    }
  }

  async findAllByUserId(params: IFindAllResumeParams, query: ResumeFindQueryDto): Promise<IResumeResponse[]> {
    try {
      const { userId } = params;
      const { desc } = query;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resumes = await this.resumeModel
        .find({ authorId: userInDb._id })
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .sort(typeof desc === 'undefined' && { createdAt: -1 })
        .exec();

      if (!resumes.length) {
        return [];
      }

      return resumeListMapper(resumes);
    } catch (err) {
      logger.error(`Error while findAllByUserId: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById(params: IFindOneResumeParams): Promise<IResumeResponse> {
    try {
      const { userId, id } = params;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resume = await this.resumeModel
        .findOne({ authorId: userInDb._id, id })
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .exec();
      if (!resume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return resumeMapper(resume);
    } catch (err) {
      logger.error(`Error while findOneById: ${(err as Error).message}`);
      throw err;
    }
  }
}
