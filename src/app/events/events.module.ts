import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Events, EventsSchema } from '@app/events/entities/events.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Events.name,
        schema: EventsSchema,
      },
    ]),
    AuthModule,
    UsersModule,
  ],
  providers: [EventsService, AuthService],
  controllers: [EventsController],
})
export class EventsModule {}
