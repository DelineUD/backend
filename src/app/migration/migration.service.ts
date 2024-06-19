import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostModel } from '@app/posts/models/posts.model';

const logger = new Logger('Migrations');

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
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
    } catch (err) {
      logger.error(`Error while ${this.migration0.name}: ${err.message}`);
    }
  }

  /**
   * Миграция для изменение поле pImg на files с изменением типа string[] -> IFile[]
   */
  async migration1() {
    try {
      await this.postModel.updateMany({ pImg: { $exists: true }, files: { $exists: false } }, [
        {
          $set: {
            files: {
              $map: {
                input: '$pImg',
                as: 'url',
                in: { type: 'image', url: '$$url' },
              },
            },
          },
        },
        {
          $unset: 'pImg',
        },
      ]);
    } catch (err) {
      logger.error(`Error while ${this.migration1.name}: ${err.message}`);
    }
  }
}
