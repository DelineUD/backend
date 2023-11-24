import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import { Resume } from './entities/resume.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { IResume } from './interfaces/resume.interface';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { IFindAllResumeParams, IFindOneResumeParams } from './interfaces/find-resume.interface';
import { IRemoveEntity } from '../shared/interfaces/remove-entity.interface';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<Resume>,
    private readonly usersService: UsersService,
  ) {}

  async create(createResumeDto: CreateResumeDto): Promise<IResume> {
    try {
      return this.resumeModel.create({ ...createResumeDto });
    } catch (err) {
      console.error(`Ошибка при создании резюме: ${(err as Error).message}`);
      throw new InternalServerErrorException(`Ошибка при создании сущности!`);
    }
  }

  async findAll(): Promise<IResume[]> {
    try {
      const resumes = await this.resumeModel.find().exec();

      if (!resumes.length) {
        return [];
      }

      return resumes;
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

      const resumes = await this.resumeModel
        .find({ author: userId })
        .populate('author', 'first_name last_name')
        .exec();

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

      const resume = await this.resumeModel
        .findOne({ author: userId, id })
        .populate('author')
        .exec();
      if (!resume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return resume;
    } catch (err) {
      console.error(`Ошибка при поиске резюме по id: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(userId: string, id: string, updateResumeDto: UpdateResumeDto) {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const resume = await this.resumeModel.findByIdAndUpdate(
        { author: userId, id },
        { ...updateResumeDto },
        { new: true, runValidators: true },
      );
      if (!resume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return resume;
    } catch (err) {
      console.error(`Ошибка при обновлении резюме: ${err.message}`);
      throw err;
    }
  }

  async remove(userId: string, id: string): Promise<IRemoveEntity<IResume>> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const deletedResume = await this.resumeModel.findOneAndDelete({ author: userId, id });
      if (!deletedResume) {
        throw new EntityNotFoundError(`Резюме не найдено`);
      }

      return { acknowledged: true, deletedCount: 1, removed: deletedResume };
    } catch (err) {
      console.error(`Ошибка при удалении резюме: ${(err as Error).message}`);
      throw err;
    }
  }
}
