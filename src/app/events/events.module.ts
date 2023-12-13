import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Events, EventsSchema } from '@app/events/entities/events.entity';
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
    UsersModule,
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
