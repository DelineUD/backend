import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostModel } from '@app/posts/models/posts.model';
import { UserModel } from '@app/users/models/user.model';
import { Vacancy } from '@app/vacancy/entities/vacancy.entity';
import { Resume } from '@app/resumes/entities/resume.entity';

const logger = new Logger('Migrations');

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    @InjectModel(Vacancy.name)
    private readonly vacancyModel: Model<Vacancy>,
    @InjectModel(Resume.name)
    private readonly resumeModel: Model<Resume>,
  ) {}

  async runMigrations() {
    try {
      await this.migration1();
    } catch (err) {
      logger.error(`Error while runMigrations: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Миграция для изменение поле group на groups с изменением значений string -> Array<string>
   */
  async migration0() {
    try {
      await this.postModel.updateMany({ group: { $exists: true } }, [
        {
          $set: {
            groups: {
              $cond: {
                if: { $gt: [{ $type: '$group' }, 'missing'] },
                then: {
                  $cond: {
                    if: { $isArray: '$group' },
                    then: '$group',
                    else: ['$group'],
                  },
                },
                else: '$groups',
              },
            },
          },
        },
        {
          $unset: 'group',
        },
      ]);
    } catch (error) {
      logger.error(`Error while ${this.migration0.name}: ${error.message}`);
    }
  }

  async migration1() {
    try {
      await this.userModel.updateMany({ remote_work: { $exists: true } }, [
        {
          $set: {
            format: {
              $cond: {
                if: { $eq: ['$remote_work', true] },
                then: 'Удаленная работа',
                else: '$$REMOVE',
              },
            },
          },
        },
        {
          $unset: 'remote_work',
        },
      ]);
      await this.resumeModel.updateMany({}, [
        {
          $set: {
            format: {
              $cond: {
                if: { $eq: ['$remote_work', true] },
                then: 'Удаленная работа',
                else: 'Работа в указанном городе, с выездами на объект',
              },
            },
          },
        },
        {
          $unset: 'remote_work',
        },
      ]);
      await this.vacancyModel.updateMany({}, [
        {
          $set: {
            format: {
              $cond: {
                if: { $eq: ['$remote_work', true] },
                then: 'Удаленная работа',
                else: 'Работа в указанном городе, с выездами на объект',
              },
            },
          },
        },
        {
          $unset: 'remote_work',
        },
      ]);
    } catch (error) {
      logger.error(`Error while ${this.migration1.name}: ${error.message}`);
    }
  }
}
