import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostModel } from '@app/posts/models/posts.model';
import { VacancyEntity } from '@app/vacancy/entities/vacancy.entity';
import { ResumeEntity } from '../resumes/entities/resume.entity';
import { UserEntity } from '../users/entities/user.entity';

const logger = new Logger('Migrations');

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
    @InjectModel(VacancyEntity.name)
    private readonly vacancyModel: Model<VacancyEntity>,
    @InjectModel(ResumeEntity.name)
    private readonly resumeModel: Model<ResumeEntity>,
  ) {}

  async runMigrations() {
    try {
      await this.migration0();
      await this.migration1();
    } catch (err) {
      logger.error(`Error while runMigrations: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Миграция для изменение полей remote_work
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

  /**
   * Миграция для изменение поле group на groups с изменением значений string -> Array<string>
   */
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

  /**
   * Миграция для обновление пользователей
   */
  async migration2() {
    try {
      await this.userModel.updateMany({}, [
        {
          $set: {
            phone: '$phone',
            email: '$email',
            password: '$password',
            first_name: '$first_name',
            last_name: { $ifNull: ['$last_name', ''] },
            birthday: { $ifNull: ['$birthday', null] },
            avatar: { $ifNull: ['$avatar', null] },
            contact_info: {
              city: { $ifNull: ['$city', ''] },
              country: { $ifNull: ['$country', ''] },
            },
            additional_info: {
              format: { $ifNull: ['$format', ''] },
              status: '$status',
              qualification: { $ifNull: ['$qualification', ''] },
              about: { $ifNull: ['$about', ''] },
            },
            bun_info: {
              blocked_users: { $ifNull: ['$blocked_users', []] },
              hidden_authors: { $ifNull: ['$hidden_authors', []] },
              hidden_posts: { $ifNull: ['$hidden_posts', []] },
            },
            preferences: {
              is_hide_phone: { $cond: [{ $eq: ['$hide_phone', true] }, 'true', 'false'] },
              is_hide_birthday: { $cond: [{ $ifNull: ['$birthday', false] }, 'false', 'true'] },
            },
            socials: {
              telegram: { $ifNull: ['$telegram', ''] },
              instagram: { $ifNull: ['$instagram', ''] },
              vk: { $ifNull: ['$vk', ''] },
              site: { $ifNull: ['$site', ''] },
            },
            courses: { $ifNull: ['$courses', []] },
            programs: { $ifNull: ['$programs', []] },
            specializations: { $ifNull: ['$specializations', []] },
            narrow_specializations: { $ifNull: ['$narrow_specializations', []] },
            is_eula_approved: { $ifNull: ['$is_eula_approved', false] },
            getcourse_id: { $ifNull: ['$getcourse_id', ''] },
          },
        },
        {
          $unset: [
            'city',
            'country',
            'format',
            'status',
            'qualification',
            'about',
            'blocked_users',
            'hidden_authors',
            'hidden_posts',
            'hide_phone',
            'telegram',
            'instagram',
            'vk',
            'site',
            'courses',
            'programs',
            'specializations',
            'narrow_specializations',
            'is_eula_approved',
            'getcourse_id',
          ],
        },
      ]);
    } catch (error) {
      logger.error(`Error while ${this.migration2.name}: ${error.message}`);
    }
  }
}
