import { Module } from '@nestjs/common';

import { FiltersModule } from '@app/filters/filters.module';
import { UsersModule } from '../users/users.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UsersModule, FiltersModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
