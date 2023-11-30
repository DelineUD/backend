import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { IEvents } from './interfaces/events.interface';
import { eventListMapper, eventMapper } from './mapper';
import { EventsModel } from './models/events.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsModel.name)
    private readonly eventsModel: Model<EventsModel>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async getEventsList(initUsr: any): Promise<any> {
    const user = await this.usersService.findOne(initUsr.user._id);
    const events = await this.eventsModel.find({}).sort({ startDate: -1 });
    return eventListMapper(events, user);
  }

  async getEventsListByMonth(month: any, year: any, initUsr: any): Promise<unknown> {
    const events = await this.eventsModel.find({}).sort({ startDate: -1 });

    const queryDate = new Date(`${year}-${month}-01`);
    const newMonth = parseInt(month, 10);
    const newYaer = parseInt(year, 10);
    const ev_d = events?.filter((i) => {
      const newStartMonth = i.startDate === undefined ? 1 : i.startDate.getMonth() + 1;
      const newStartYear = i.startDate === undefined ? 1 : i.startDate.getFullYear();

      if (
        (newStartMonth === newMonth && newStartYear === newYaer) ||
        (queryDate < i.stopDate && queryDate > i.sartDate)
      ) {
        return i;
      }
    });
    return eventListMapper(ev_d, initUsr);
  }

  async create(eventDto: IEvents): Promise<IEvents> {
    const { _id, authorId, hText, hImg, startDate, stopDate, addr, category, access, format, bodyText } = eventDto;

    const newStartDate = new Date(startDate);
    const newStopDate = new Date(stopDate);
    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (eventInDb) {
      throw new HttpException('Это событие уже существует!', HttpStatus.CONFLICT);
    }

    const event: EventsModel = new this.eventsModel({
      authorId,
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

    await event.save();

    return event;
  }

  async update(eventDto: IEvents): Promise<IEvents> {
    const { _id, authorId, hText, hImg, startDate, stopDate, addr, category, access, format, bodyText } = eventDto;

    const newStartDate = new Date(startDate);
    const newStopDate = new Date(stopDate);

    const eventInDb = await this.eventsModel.findOne({ _id }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие с id: ${_id} не найдено!`);
    }

    if (authorId !== eventInDb.authorId) {
      throw new HttpException('У вас нет доступа!', HttpStatus.BAD_REQUEST);
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
    return await this.eventsModel.findOne({ _id }).exec();
  }

  async delete(eventDto: IEvents): Promise<IEvents> {
    const { _id, authorId } = eventDto;

    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (!eventInDb) {
      throw new EntityNotFoundError('Событие не найдено!');
    } else if (authorId === eventInDb.authorId) {
      await eventInDb.deleteOne({
        _id,
      });

      if (eventInDb) {
        throw new HttpException('Успешно удалено!', HttpStatus.NO_CONTENT);
      }

      return eventInDb;
    } else {
      throw new HttpException('У вас нет доступа!', HttpStatus.BAD_REQUEST);
    }
  }

  async getEventById(getEventParamsDto: any, initUsr: any): Promise<any> {
    const _id = getEventParamsDto._id;
    const user = await this.usersService.findOne(initUsr.user._id);
    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие с id: ${_id} не найдено!`);
    }
    return eventMapper(eventInDb, user);
  }

  async EventIGo(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Событие с id: ${event} не найдено!`);
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
        iGo: arrGoNotGo.unshift(user._id),
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
      throw new EntityNotFoundError(`Событие с id: ${event} не найдено!`);
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
        notGo: arrGoNotGo.unshift(user._id),
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
        notGo: arrGoNotGo.unshift(user._id),
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
      throw new EntityNotFoundError(`Событие с id: ${event} не найдено!`);
    }
    const arrGoNotGo = eventInDb.favor;
    let checkResult: boolean;

    if (arrGoNotGo.length === 0) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(user._id),
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
        favor: arrGoNotGo.unshift(user._id),
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
