import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FiltersModule } from '@app/filters/filters.module';
import { FiltersService } from '@app/filters/filters.service';
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
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
