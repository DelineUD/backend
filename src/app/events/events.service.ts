import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { IEvents } from './interfaces/events.interface';
import { EventsModel } from './models/events.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsModel.name)
    private readonly eventsModel: Model<EventsModel>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async getPostsList(initUsr: any): Promise<any> {
    const user = await this.usersService.findOne(initUsr.user._id);
    const events = await this.eventsModel.find({}).sort({ createdAt: -1 });

    return events;
  }

  async create(eventDto: IEvents): Promise<IEvents> {
    const {
      _id,
      authorId,
      hText,
      hImg,
      startDate,
      stopDate,
      addr,
      category,
      access,
      format,
      bodyText,
    } = eventDto;

    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (eventInDb) {
      throw new HttpException(
        'This ivent already created ',
        HttpStatus.BAD_REQUEST,
      );
    }
    const event: EventsModel = await new this.eventsModel({
      _id,
      authorId,
      hText,
      hImg,
      startDate,
      stopDate,
      addr,
      category,
      access,
      format,
      bodyText,
    });

    await event.save();

    return event;
  }

  async update(eventDto: IEvents): Promise<IEvents> {
    const {
      _id,
      authorId,
      hText,
      hImg,
      startDate,
      stopDate,
      addr,
      category,
      access,
      format,
      bodyText,
    } = eventDto;

    const eventInDb = await this.eventsModel.findOne({ _id }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Ивен с id: ${_id}, не найден`);
    }

    if (authorId !== eventInDb.authorId) {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }

    await eventInDb.updateOne({
      hText,
      hImg,
      startDate,
      stopDate,
      addr,
      category,
      access,
      format,
      bodyText,
    });
    await eventInDb.save();
    const newEventInDb = await this.eventsModel.findOne({ _id }).exec();
    return newEventInDb;
  }

  async delete(eventDto: IEvents): Promise<IEvents> {
    const { _id, authorId } = eventDto;

    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (!eventInDb) {
      throw new EntityNotFoundError('не найден ивент для удаления');
    } else if (authorId === eventInDb.authorId) {
      await eventInDb.deleteOne({
        _id,
      });

      if (eventInDb) {
        throw new HttpException('OK Deleted', HttpStatus.NO_CONTENT);
      }

      return eventInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }

  async getEventById(getEventParamsDto: any, initUsr: any): Promise<any> {
    const _id = getEventParamsDto._id;
    const user = await this.usersService.findOne(initUsr.user._id);
    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (!eventInDb) {
      throw new EntityNotFoundError('пост не найден');
    }

    return eventInDb;
  }
}
