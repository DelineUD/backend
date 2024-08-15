import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model, Types } from 'mongoose';

import { CreateEventDto } from '@app/events/dto/create.event.dto';
import { UpdateEventsDto } from '@app/events/dto/update-events.dto';
import { Events } from '@app/events/entities/events.entity';

import { EventDto } from '@app/events/dto/event.dto';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { IEvents } from './interfaces/events.interface';
import { eventListMapper, eventMapper } from './mapper';

const logger = new Logger('Events');

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name)
    private readonly eventsModel: Model<Events>,
    private readonly usersService: UsersService,
  ) {}

  async getEventsList(userId: Types.ObjectId): Promise<IEvents[]> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError('Пользователь не найден');
      }
      const events = await this.eventsModel.find({}).sort({ startDate: -1 });

      return eventListMapper(events, userInDb._id);
    } catch (err) {
      throw err;
    }
  }

  async getEventsListByMonth(month: any, year: any, userId: Types.ObjectId): Promise<IEvents[]> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });

      const events = await this.eventsModel.find().sort({ startDate: -1 });

      const queryDate = new Date(`${year}-${month}-01`);
      const newMonth = parseInt(month, 10);
      const newYaer = parseInt(year, 10);
      const ev_d = events?.filter((i) => {
        const newStartMonth = i.startDate === undefined ? 1 : i.startDate.getMonth() + 1;
        const newStartYear = i.startDate === undefined ? 1 : i.startDate.getFullYear();

        if (
          (newStartMonth === newMonth && newStartYear === newYaer) ||
          (queryDate < i.stopDate && queryDate > i.startDate)
        ) {
          return i;
        }
      });
      return eventListMapper(ev_d, userInDb._id);
    } catch (err) {
      throw err;
    }
  }

  async create(file: Express.Multer.File, createEventDto: CreateEventDto): Promise<IEvents> {
    try {
      const { startDate, stopDate, ...restDto }: EventDto = createEventDto;

      const eventInDb = await this.eventsModel.findOne({ hText: createEventDto.hText }).exec();
      if (eventInDb) {
        throw new HttpException('Это событие уже существует!', HttpStatus.CONFLICT);
      }

      const pathToImage = file && `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`;

      const event: Events = new this.eventsModel({
        startDate: new Date(startDate),
        stopDate: new Date(stopDate),
        hImg: pathToImage,
        ...restDto,
      });

      logger.log('Event successfully created!');

      return event.save();
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(id: Types.ObjectId, eventDto: UpdateEventsDto): Promise<IEvents> {
    const { hText, hImg, startDate, stopDate, addr, category, access, format, bodyText } = eventDto;

    const newStartDate = new Date(startDate);
    const newStopDate = new Date(stopDate);

    const eventInDb = await this.eventsModel.findOne({ _id: id }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие не найдено!`);
    }

    await eventInDb.updateOne({
      hText,
      hImg,
      startDate: newStartDate.toISOString(),
      stopDate: newStopDate.toISOString(),
      addr,
      category,
      access,
      format,
      bodyText,
    });
    await eventInDb.save();

    return await this.eventsModel.findOne({ _id: id }).exec();
  }

  async deleteOneById(userId: Types.ObjectId, eventId: Types.ObjectId): Promise<DeleteResult> {
    try {
      const deleteResult = await this.eventsModel.findByIdAndDelete({ _id: eventId }).exec();
      if (!deleteResult) {
        throw new EntityNotFoundError('Событие не найдено');
      }

      logger.log('Event successfully deleted!');

      return {
        acknowledged: true,
        deletedCount: 1,
      };
    } catch (err) {
      logger.error(`Error while delete: ${(err as Error).message}`);
      throw err;
    }
  }

  async getEventById(getEventParamsDto: any, initUsr: any): Promise<any> {
    const _id = getEventParamsDto._id;
    const user = await this.usersService.findOne(initUsr.user._id);
    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие найдено!`);
    }
    return eventMapper(eventInDb, user);
  }

  async EventIGo(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие не найдено!`);
    }
    const arrGoNotGo = eventInDb.iGo;
    let checkResult: boolean;
    let checkResultNotGo: boolean;

    if (eventInDb.notGo.includes(user._id.toString())) {
      checkResultNotGo = true;
    }

    if (checkResultNotGo === true) {
      const filteredArray = eventInDb.notGo.filter((f) => {
        return f != user._id.toString();
      });
      await eventInDb.updateOne({
        notGo: filteredArray,
      });
      await eventInDb.save();
    }

    arrGoNotGo.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await eventInDb.updateOne({
        iGo: arrGoNotGo.unshift(String(user._id)),
      });
      await eventInDb.save();
      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }

    if (checkResult === true) {
      const filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        iGo: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }
  }

  async EventINotGo(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие не найдено!`);
    }
    const arrGoNotGo = eventInDb.notGo;
    let checkResult: boolean;
    let checkResultItGo: boolean;

    if (eventInDb.iGo.includes(user._id.toString())) {
      checkResultItGo = true;
    }
    if (checkResultItGo === true) {
      const filteredArray = eventInDb.iGo.filter((f) => {
        return f != user._id.toString();
      });
      await eventInDb.updateOne({
        iGo: filteredArray,
      });
      await eventInDb.save();
    }

    if (arrGoNotGo.length === 0) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(String(user._id)),
      });
      await eventInDb.save();
      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }

    arrGoNotGo.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(String(user._id)),
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }

    if (checkResult === true) {
      const filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        notGo: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }
  }

  async EventFavor(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие не найдено!`);
    }
    const arrGoNotGo = eventInDb.favor;
    let checkResult: boolean;

    if (arrGoNotGo.length === 0) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(String(user._id)),
      });
      await eventInDb.save();
      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }

    arrGoNotGo.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await eventInDb.updateOne({
        favor: arrGoNotGo.unshift(String(user._id)),
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();
      return eventMapper(newEventInDb, user);
    }

    if (checkResult === true) {
      const filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        favor: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel.findOne({ _id: event }).exec();

      return eventMapper(newEventInDb, user);
    }
  }
}
