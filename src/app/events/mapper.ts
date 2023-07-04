import { IEvents } from './interfaces/events.interface';
import { EventsModel } from './models/events.model';

export const eventListMapper = (
  events: EventsModel[],
  user: any,
): IEvents[] => {
  return events.map((event) => ({
    _id: event._id,
    authorId: event.authorId,
    hText: event.hText ?? null,
    hImg: event.hImg ?? null,
    startDate: event.startDate ?? null,
    stopDate: event.stopDate,
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
  }));
};

export const eventMapper = (event: EventsModel, user: any): any => {
  return {
    _id: event._id,
    authorId: event.authorId,
    hText: event.hText ?? null,
    hImg: event.hImg ?? null,
    startDate: event.startDate ?? null,
    stopDate: event.stoptDate ?? null,
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
