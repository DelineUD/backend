import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';

import { Resume } from './entities/resume.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { IResume } from './interfaces/resume.interface';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private readonly resumeModel: Model<Resume>) {}

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
        throw new EntityNotFoundError(`Резюме не найдены`);
      }

      return resumes;
    } catch (err) {
      console.error(`Ошибка при поиске резюме: ${(err as Error).message}`);
      throw new EntityNotFoundError(`Резюме не найдены`);
    }
  }

  async findAllByUserId(params: { userId: string }) {
    const { userId } = params;
    try {
      const resumes = await this.resumeModel
        .find({ author: userId })
        .populate('author', 'first_name last_name')
        .exec();

      if (!resumes.length) {
        throw new EntityNotFoundError(`Список резюме пользователя ${userId}`);
      }

      return resumes;
    } catch (err) {
      console.error(`Ошибка при поиске резюме пользователя: ${(err as Error).message}`);
      throw new EntityNotFoundError(`Список резюме пользователя ${userId}`);
    }
  }

  async findOneByIds(params: { userId: string; id: string }) {
    const { userId, id } = params;
    try {
      const resume = await this.resumeModel
        .findOne({ author: userId, id })
        .populate('author')
        .exec();

      if (!resume) {
        throw new EntityNotFoundError(`Резюме ${id} не найдено`);
      }

      return resume;
    } catch (err) {
      console.error(`Ошибка при поиске резюме по ID: ${(err as Error).message}`);
      throw new EntityNotFoundError(`Резюме ${id} не найдено`);
    }
  }

  async update(userId: string, id: string, updateResumeDto: UpdateResumeDto) {
    try {
      const resume = await this.resumeModel.findByIdAndUpdate(
        { author: userId, id },
        { ...updateResumeDto },
        { new: true, runValidators: true },
      );

      if (!resume) {
        throw new EntityNotFoundError(`Резюме с ${id} не найдено`);
      }

      return resume;
    } catch (err) {
      console.error(`Ошибка при обновлении резюме: ${err.message}`);
      throw err;
    }
  }

  async remove(userId: string, id: string): Promise<DeleteResult & { removed: IResume }> {
    try {
      const deletedResume = await this.resumeModel.findOneAndDelete({ author: userId, id });

      if (!deletedResume) {
        throw new EntityNotFoundError(`Резюме с ${id} не найдено`);
      }

      return { acknowledged: true, deletedCount: 1, removed: deletedResume };
    } catch (err) {
      console.error(`Ошибка при удалении резюме: ${(err as Error).message}`);
      throw err;
    }
  }
}
