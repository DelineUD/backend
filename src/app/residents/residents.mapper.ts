import { UserModel } from '../users/models/user.model';
import { IResidentList } from './interfaces/resident.interface-list';
import { IResident } from './interfaces/resident.interface';
import { IUser } from '@app/users/interfaces/user.interface';
import { IFilters } from '@app/filters/interfaces/filters.interface';

export const residentListMapper = (user: UserModel[]): IResidentList[] => {
  return user.map(residentsMapper);
};

export const residentsMapper = (user: UserModel): IResidentList => {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar ?? null,
    status: user.status ?? null,
  };
};

export const residentMapper = (user: IUser): IResident => {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    about: user.about ?? null,
    status: user.status ?? null,
    avatar: user.avatar ?? null,

    personal_information: [
      {
        birthday: user.birthday ?? null,
        gender: user.gender ?? null,
        country: user.country ?? null,
        city: user.city ?? null,
      },
    ],
    description_fields: [
      {
        filed: 'Владение программами',
        items: user.programs,
      },
      {
        filed: 'Пройденные курсы',
        items: user.courses,
      },
      {
        filed: 'Специализация',
        items: user.specializations,
      },
      {
        filed: 'Узкая специализация',
        items: user.narrow_specializations,
      },
    ],
  };
};

export const residentQueryMapper = (queryParam: PromiseSettledResult<IFilters>): string => {
  if (queryParam.status === 'rejected') {
    return;
  }
  return queryParam.value?.name;
};

export const residentQueriesMapper = (queryParam: PromiseSettledResult<IFilters[]>, allMatch = false) => {
  if (queryParam.status === 'rejected') {
    return;
  }
  const arrQueries = queryParam.value?.reduce((acc, i) => i && [...acc, i.name], []) ?? [];
  return !allMatch && !arrQueries.length ? arrQueries : { $in: arrQueries };
};
