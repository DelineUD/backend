import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ProfilesBlockDto } from '@app/profiles/dto/profiles-block.dto';
import { ProfileUpdateDto } from '@app/profiles/dto/profile-update.dto';
import { fileStorageConfig } from '@shared/storage/storage.config';
import { mediaFileFilter } from '@utils/mediaFileFilter';
import { UserId } from '@shared/decorators/user-id.decorator';
import { ProfilesFindQueryDto } from '@app/profiles/dto/profiles-find-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { ProfileGetParamsDto } from './dto/profile-get-params.dto';
import { IProfileResponse } from './interfaces/profile.interface';
import { IProfileListResponse } from './interfaces/profile-list.interface';
import { ProfileService } from './profile.service';
import { IFilter } from '@app/filters/interfaces/filters.interface';
import { FiltersService } from '@app/filters/filters.service';

@ApiTags('Profiles')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService, private filtersService: FiltersService) {}

  /**
   * Обновление профиля
   * @param userId - идентификатор профиля.
   * @param profileUpdateDto - данные для обновления
   * @param avatar - файл для аватарки
   * @returns - обновленный пользователь.
   */
  @Patch()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ProfileUpdateDto })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: fileStorageConfig,
      fileFilter: mediaFileFilter,
    }),
  )
  async update(
    @UserId() userId: Types.ObjectId,
    @Body() profileUpdateDto: ProfileUpdateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<IProfileResponse> {
    return await this.profileService.update(userId, profileUpdateDto, avatar);
  }

  /**
   * Нахождение списка профилей
   * @param userId - идентификатор пользователя.
   * @param queryParams - параметры для поиска.
   * @returns - список профилей.
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams?: ProfilesFindQueryDto,
  ): Promise<IProfileListResponse> {
    return await this.profileService.findAll(userId, queryParams);
  }

  /**
   * Получение фильтров для профилей.
   * @returns - фильтры профилей.
   */
  @Get('filters')
  public async getProfilesFilter(): Promise<IFilter[]> {
    console.log('Fetching filters');
    return await Promise.all([
      await this.filtersService.getCitiesFilter(),
      await this.filtersService.getSpecializationsFilter(),
      await this.filtersService.getProgramsFilter(),
      this.filtersService.getQualificationsFilter(),
      this.filtersService.getFormatFilter(),
      this.filtersService.getExperienceFilter(),
      this.filtersService.getInvolvementFilter(),
    ]);
  }

  /**
   * Нахождение профиля по идентификатору
   * @param userId - идентификатор пользователя.
   * @param params - параметры для поиска.
   * @returns - список профилей.
   */
  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'id', type: 'string', description: 'Системный идентификатор профиля' })
  async findOneById(@UserId() userId: Types.ObjectId, @Param() params: ProfileGetParamsDto): Promise<IProfileResponse> {
    return await this.profileService.findOneById(userId, params);
  }

  /**
   * Удаление профиля
   * @param userId - идентификатор пользователя.
   * @returns - список профилей.
   */
  @Delete()
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@UserId() userId: Types.ObjectId): Promise<void> {
    return this.profileService.delete(userId);
  }

  /**
   * Смена блокировки профиля
   * @param userId - идентификатор пользователя.
   * @param dto - данные для блокировки.
   * @returns - список профилей.
   */
  @Patch('block')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async blockResident(@UserId() userId: Types.ObjectId, @Body() dto: ProfilesBlockDto): Promise<void> {
    return this.profileService.blockProfile(userId, dto);
  }
}
