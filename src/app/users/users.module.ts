import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResumesModule } from '@app/resumes/resumes.module';
import { FiltersModule } from '@app/filters/filters.module';
import { VacancyModule } from '@app/vacancy/vacancy.module';
import { PostsModule } from '@app/posts/posts.module';
import { UsersService } from './users.service';
import { UserModel, UserSchema } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
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
