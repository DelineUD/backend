import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
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
    const _id = initUsr;
    const user = await this.usersService.findOne(initUsr.user._id);
    const events = await this.eventsModel.find({}).sort({ createdAt: -1 });
    const res = eventListMapper(events, user);
    return res;
  }

  async getEventsListByMonth(
    month: any,
    year: any,
    initUsr: any,
  ): Promise<any> {
    const events = await this.eventsModel.find({}).sort({ createdAt: -1 });

    const queryDate = new Date(`${year}-${month}-01`);
    const newMonth = parseInt(month, 10);
    const newYaer = parseInt(year, 10);
    const ev_d = events?.filter((i) => {
      const newStartMonth =
        i.startDate === undefined ? 1 : i.startDate.getMonth() + 1;
      const newStartYear =
        i.startDate === undefined ? 1 : i.startDate.getFullYear();

      if (
        (newStartMonth === newMonth && newStartYear === newYaer) ||
        queryDate < i.stopDate
      ) {
        return i;
      }
    });
    return ev_d;
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

    const newStartDate = new Date(startDate);
    const newStopDate = new Date(stopDate);
    const eventInDb = await this.eventsModel.findOne({ _id }).exec();
    if (eventInDb) {
      throw new HttpException(
        'This ivent already created ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event: EventsModel = await new this.eventsModel({
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

    const newStartDate = new Date(startDate);
    const newStopDate = new Date(stopDate);

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
      startDate: newStartDate.toISOString(),
      stopDate: newStopDate.toISOString(),
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
      throw new EntityNotFoundError('ивент не найден');
    }
    const res = eventMapper(eventInDb, user);
    return res;
  }

  async EventIGo(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Ивент с id: ${event}, не найден`);
    }
    let arrGoNotGo = eventInDb.iGo;
    let checkResult;
    let checkResultNotGo;

    if (eventInDb.notGo.includes(user._id.toString())) {
      checkResultNotGo = true;
    }

    if (checkResultNotGo === true) {
      let filteredArray = eventInDb.notGo.filter((f) => {
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
      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
    }

    if (checkResult === true) {
      let filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        iGo: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
    }
  }

  async EventINotGo(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Ивент с id: ${event}, не найден`);
    }
    let arrGoNotGo = eventInDb.notGo;
    let checkResult;
    let checkResultItGo;

    if (eventInDb.iGo.includes(user._id.toString())) {
      checkResultItGo = true;
    }
    if (checkResultItGo === true) {
      let filteredArray = eventInDb.iGo.filter((f) => {
        return f != user._id.toString();
      });
      await eventInDb.updateOne({
        iGo: filteredArray,
      });
      await eventInDb.save();
      console.log('da');
    }

    if (arrGoNotGo.length === 0) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(user._id),
      });
      await eventInDb.save();
      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
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

      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
    }

    if (checkResult === true) {
      let filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        notGo: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
    }
  }

  async EventFavor(event: any, initUser: any): Promise<IEvents> {
    const user = await this.usersService.findOne(initUser.user._id);

    const eventInDb = await this.eventsModel.findOne({ _id: event }).exec();

    if (!eventInDb) {
      throw new EntityNotFoundError(`Ивент с id: ${event}, не найден`);
    }
    let arrGoNotGo = eventInDb.favor;
    let checkResult;

    if (arrGoNotGo.length === 0) {
      await eventInDb.updateOne({
        notGo: arrGoNotGo.unshift(user._id),
      });
      await eventInDb.save();
      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
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

      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();
      const res = eventMapper(newEventInDb, user);
      return res;
    }

    if (checkResult === true) {
      let filteredArray = arrGoNotGo.filter((f) => {
        return f != user._id.toString();
      });

      await eventInDb.updateOne({
        favor: filteredArray,
      });
      await eventInDb.save();

      const newEventInDb = await this.eventsModel
        .findOne({ _id: event })
        .exec();

      const res = eventMapper(newEventInDb, user);
      return res;
    }
  }
}
