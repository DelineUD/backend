import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostModel, PostsSchema } from '@app/posts/models/posts.model';
import { Resume, ResumeSchema } from '@app/resumes/entities/resume.entity';
import { VacancyEntity, VacancySchema } from '@app/vacancy/entities/vacancy.entity';
import { UserEntity, UserSchema } from '../users/entities/user.entity';
import { MigrationService } from './migration.service';

const logger = new Logger('Migrations');

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PostModel.name,
        useFactory: () => PostsSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: UserEntity.name,
        useFactory: () => UserSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: VacancyEntity.name,
        useFactory: () => VacancySchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Resume.name,
        useFactory: () => ResumeSchema,
      },
    ]),
  ],
  providers: [MigrationService],
})
export class MigrationModule implements OnModuleInit {
  constructor(private migrationService: MigrationService) {}

  onModuleInit(): void {
    this.migrationService.runMigrations().then(() => logger.log('Migrations completed!'));
  }
}
