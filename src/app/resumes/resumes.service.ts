import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';

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

      const dto = { author: user._id, ...resumeParams } as ResumeDto;
      const normalizedDto = normalizeDto(dto, '_resume') as ResumeDto[];
      const resumesMapped = normalizedDto.map((r) => resumeDtoMapper(r));

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

  async findAll({ remote_work, desc, ...queryParams }: ResumeFindQueryDto): Promise<IResumeResponse[]> {
    try {
      const query: FilterQuery<Partial<IResume>> = await getMainFilters(this.filtersService, queryParams);
      remote_work && (query.remote_work = remote_work);

      const resumes = await this.resumeModel
        .find(query)
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .sort(typeof desc !== 'undefined' && { createdAt: -1 })
        .exec();

      return resumeListMapper(resumes);
    } catch (err) {
      console.error(`Ошибка при поиске резюме: ${(err as Error).message}`);
      throw new InternalServerErrorException(`Внутрення ошибка сервера!`);
    }
  }

  async findAllByUserId(params: IFindAllResumeParams): Promise<IResumeResponse[]> {
    try {
      const { userId } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resumes = await this.resumeModel
        .find({ author: user._id })
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .exec();

      if (!resumes.length) {
        return [];
      }

      return resumeListMapper(resumes);
    } catch (err) {
      console.error(`Ошибка при поиске резюме: ${(err as Error).message}`);
      throw err;
    }
  }

  async findOneById(params: IFindOneResumeParams): Promise<IResumeResponse> {
    try {
      const { userId, id } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resume = await this.resumeModel
        .findOne({ author: user._id, _id: id })
        .populate('author', '_id first_name last_name avatar telegram qualification')
        .exec();
      if (!resume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return resumeMapper(resume);
    } catch (err) {
      console.error(`Ошибка при поиске резюме по id: ${(err as Error).message}`);
      throw err;
    }
  }
}
