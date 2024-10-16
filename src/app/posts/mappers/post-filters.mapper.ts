import { FilterQuery, Types } from 'mongoose';

import { UserEntity } from '@/app/users/entities/user.entity';
import { UsersService } from '@/app/users/users.service';
import { FiltersService } from '@app/filters/filters.service';
import { IPostsFindQuery } from '../interfaces/post-find-query';
import { IPosts } from '../interfaces/posts.interface';

export async function postFiltersMapper(
  filtersService: FiltersService,
  usersService: UsersService,
  queryParams: FilterQuery<Partial<IPostsFindQuery>>,
  user: Partial<UserEntity>,
): Promise<Partial<FilterQuery<Partial<IPosts>>>> {
  const { groups, userId, ...baseQueries } = queryParams;

  const queryFilter: Partial<FilterQuery<Partial<IPosts>>> = {
    ...(baseQueries.search && { pText: { $regex: new RegExp(baseQueries.search, 'i') } }),
    ...(baseQueries.publishInProfile !== undefined && { publishInProfile: baseQueries.publishInProfile }),
    _id: {
      $nin: user.bun_info?.hidden_posts ?? [],
      ...(baseQueries.lastIndex && { $lt: baseQueries.lastIndex }),
    },
  };

  if (groups) {
    const foundGroups = await filtersService.findGroupsByPayload({ _id: { $in: groups } });
    if (foundGroups) {
      queryFilter.groups = foundGroups.map((g) => g.name);
    }
  }

  if (userId) {
    const queryUser = await usersService.findOne({ _id: userId as unknown as Types.ObjectId });
    if (queryUser) {
      queryFilter.authorId = queryUser._id;
    }
  } else {
    queryFilter.authorId = { $nin: user.bun_info?.hidden_posts ?? [] };
  }

  return queryFilter;
}
