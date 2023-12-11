import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from '../users/models/user.model';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService, AuthService],
})
export class ResidentsModule {}
