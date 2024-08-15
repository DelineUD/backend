import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FiltersModule } from '@app/filters/filters.module';
import { ResumesModule } from '@app/resumes/resumes.module';
import { VacancyModule } from '@app/vacancy/vacancy.module';
import { PostsModule } from '@app/posts/posts.module';
import { UserEntity, UserSchema } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
    ]),
    FiltersModule,
    forwardRef(() => PostsModule),
    forwardRef(() => ResumesModule),
    forwardRef(() => VacancyModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
