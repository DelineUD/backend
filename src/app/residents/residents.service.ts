import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { GetResidentParamsDto } from './dto/get-resident-params.dto';
import { IResident } from './interfaces/resident.interface';
import { IResidentList } from './interfaces/resident.interface-list';
import { residentListMapper, residentMapper, residentQueriesMapper, residentQueryMapper } from './residents.mapper';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { ResidentsFindQueryDto } from '@app/residents/dto/residents-find-query.dto';
import { FiltersService } from '@app/filters/filters.service';
import { IUser } from '@app/users/interfaces/user.interface';
import { StatusFilterKeys } from '@app/filters/consts';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private usersService: UsersService,
    private readonly filtersService: FiltersService,
  ) {}

  async findAll({ status, ...queryParams }: Partial<ResidentsFindQueryDto>): Promise<IResidentList[]> {
    try {
      const query: FilterQuery<Partial<IUser>> = { ...queryParams };

      const { countryPromise, cityPromise, specPromises, nSpecPromises, programsPromises, coursesPromises } =
        this.filtersService.getFiltersPromises(query);

      const [country, city, spec, narrowSpec, programs, courses] = await Promise.allSettled([
        countryPromise,
        cityPromise,
        Promise.all(specPromises),
        Promise.all(nSpecPromises),
        Promise.all(programsPromises),
        Promise.all(coursesPromises),
      ]);

      residentQueryMapper(country) && (query.country = residentQueryMapper(country));
      residentQueryMapper(city) && (query.city = residentQueryMapper(city));
      residentQueriesMapper(spec) && (query.specializations = residentQueriesMapper(spec));
      residentQueriesMapper(narrowSpec) && (query.narrow_specializations = residentQueriesMapper(narrowSpec));
      residentQueriesMapper(programs) && (query.programs = residentQueriesMapper(programs));
      residentQueriesMapper(courses) && (query.courses = residentQueriesMapper(courses));
      status && (query.status = StatusFilterKeys[query.status]);

      return await this.usersService.findAll(query).then(residentListMapper);
    } catch (err) {
      throw err;
    }
  }

  async findOneById({ id }: GetResidentParamsDto): Promise<IResident> {
    try {
      const resident = await this.usersService.findOne({ _id: id });
      return residentMapper(resident);
    } catch (err) {
      throw new EntityNotFoundError(`Пользователь не найден`);
    }
  }

  async uploadAvatar(userId: Types.ObjectId, file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('Файл не найден!');
      }

      const pathToImage = `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`;
      const resident = await this.userModel
        .findOneAndUpdate({
          _id: userId,
          avatar: pathToImage,
        })
        .exec();
      if (!resident) {
        throw new EntityNotFoundError('Пользователь не найден');
      }
      console.log(file);

      return pathToImage;
    } catch (err) {
      throw err;
    }
  }
}
