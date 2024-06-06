import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostModel, PostsSchema } from '@app/posts/models/posts.model';
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
  ],
  providers: [MigrationService],
})
export class MigrationModule implements OnModuleInit {
  constructor(private migrationService: MigrationService) {}

  onModuleInit(): void {
    this.migrationService.runMigrations().then(() => logger.log('Migrations completed!'));
  }
}
