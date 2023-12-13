import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from '../users/models/user.model';
import { UsersModule } from '../users/users.module';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { FiltersModule } from '@app/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    FiltersModule,
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}
