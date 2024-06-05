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
}
