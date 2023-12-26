import { Types } from 'mongoose';

import { IEvents } from './interfaces/events.interface';

export const eventListMapper = (events: IEvents[], userId: Types.ObjectId): IEvents[] => {
  return events.map((event) => ({
    _id: event._id,
    author: event.author,
    hText: event.hText ?? null,
    hImg: event.hImg ?? null,
    startDate: event.startDate ?? null,
    stopDate: event.stopDate ?? null,
    createdAt: event.createdAt ?? null,
    updatedAt: event.updatedAt ?? null,
    addr: event.addr ?? null,
    category: event.category ?? null,
    access: event.access ?? null,
    format: event.format ?? null,
    bodyText: event.bodyText ?? null,
    favor_event: event.favor.includes(String(userId)),
    not_go: event.notGo.includes(String(userId)),
    i_Go: event.iGo.includes(String(userId)),
  }));
};

export const eventMapper = (event: IEvents, user: any): any => {
  return {
    _id: event._id,
    author: event.author,
    hText: event.hText ?? null,
    hImg: event.hImg ?? null,
    startDate: event.startDate ?? null,
    stopDate: event.stopDate ?? null,
    createdAt: event.createdAt ?? null,
    updatedAt: event.updatedAt ?? null,
    addr: event.addr ?? null,
    category: event.category ?? null,
    access: event.access ?? null,
    format: event.format ?? null,
    bodyText: event.bodyText ?? null,
    favor_event: event.favor.includes(user._id.toString()),
    not_go: event.notGo.includes(user._id.toString()),
    i_Go: event.iGo.includes(user._id.toString()),
  };
};
