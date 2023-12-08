import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { filterQueries } from '@helpers/filterQueries';
import normalizeDto from '@utils/normalizeDto';
import { resumeMapper } from '@app/resumes/resume.mapper';
import { ICrudResumeParams } from '@app/resumes/interfaces/crud-resume.interface';
import { ResumeDto } from '@app/resumes/dto/resume.dto';
import { Resume } from './entities/resume.entity';
import { IResume } from './interfaces/resume.interface';
import { UsersService } from '../users/users.service';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';
import { ResumeFindQueryDto } from '@app/resumes/dto/resume-find-query.dto';
import { IVacancy } from '@app/vacancy/interfaces/vacancy.interface';
import { FilterKeys, StatusFilterKeys } from '@app/filters/consts';
import { residentQueriesMapper } from '@app/residents/residents.mapper';
import { FiltersService } from '@app/filters/filters.service';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<Resume>,
    private readonly usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async update(userId: Types.ObjectId, resumeParams: ICrudResumeParams): Promise<IResume | IResume[]> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const dto = { author: userId, ...resumeParams } as ResumeDto;
      const normalizedDto = normalizeDto(dto, '_resume') as ResumeDto[];
      const resumesMapped = normalizedDto.map((r) => resumeMapper(r));

      await Promise.all([
        await this.resumeModel.deleteMany({ author: userId }),
        await this.resumeModel.create(...resumesMapped),
      ]);

      return await this.resumeModel.find({ ...resumesMapped });
    } catch (err) {
      console.error(`Ошибка при обновлении резюме: ${(err as Error).message}`);
      throw new InternalServerErrorException('Ошибка при обновлении резюме!');
    }
  }

  async findAll({ remote_work, desc, ...queryParams }: ResumeFindQueryDto): Promise<IResume[]> {
    try {
      const query: FilterQuery<Partial<IResume>> = { ...queryParams };

      const { specPromises, nSpecPromises, programsPromises } = this.filtersService.getFiltersPromises(query);

      const [spec, narrowSpec, programs] = await Promise.allSettled([
        Promise.all(specPromises),
        Promise.all(nSpecPromises),
        Promise.all(programsPromises),
      ]);

      residentQueriesMapper(spec) && (query.specializations = residentQueriesMapper(spec));
      residentQueriesMapper(narrowSpec) && (query.narrow_specializations = residentQueriesMapper(narrowSpec));
      residentQueriesMapper(programs) && (query.programs = residentQueriesMapper(programs));
      remote_work && (query.remote_work = remote_work);

      return await this.resumeModel
        .find(query)
        .sort(typeof desc !== 'undefined' && { createdAt: -1 })
        .exec();
    } catch (err) {
      console.error(`Ошибка при поиске резюме: ${(err as Error).message}`);
      throw new InternalServerErrorException(`Внутрення ошибка сервера!`);
    }
  }

  async findAllByUserId(params: IFindAllResumeParams) {
    try {
      const { userId } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resumes = await this.resumeModel.find({ author: userId }).populate('author', 'first_name last_name').exec();

      if (!resumes.length) {
        return [];
      }

      return resumes;
    } catch (err) {
      console.error(`Ошибка при поиске резюме: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById(params: IFindOneResumeParams) {
    try {
      const { userId, id } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resume = await this.resumeModel.findOne({ author: userId, id }).populate('author').exec();
      if (!resume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return resume;
    } catch (err) {
      console.error(`Ошибка при поиске резюме по id: ${(err as Error).message}`);
      throw err;
    }
  }
}
