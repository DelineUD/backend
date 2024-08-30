import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

import { UserUpdateDto } from '@app/users/dto/user-update.dto';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';
import { EUserQualification } from '@shared/consts/user-qualification.enum';
import { validateArrayOfQualification } from '@shared/validators/validateArrayOfQualification';
import { ILink, IQualification } from '@app/users/interfaces/user.interface';
import { validateArrayOfLinks } from '@shared/validators/validateArrayOfLinks';
import { validateArrayOfString } from '@shared/validators/validateArrayOfString';
import { validatePhoneNumber } from '@shared/validators/validatePhoneNumber';

export class ProfileUpdateDto extends PartialType(UserUpdateDto) {
  @ApiPropertyOptional({ default: '+79992456800', description: 'Номер телефона пользователя' })
  @Transform(validatePhoneNumber)
  phone?: string;

  @ApiPropertyOptional({ default: 'user@example.com', description: 'Электронная почта пользователя' })
  email?: string;

  @ApiPropertyOptional({ default: 'root', description: 'Пароль пользователя' })
  password?: string;

  @ApiPropertyOptional({ default: 'Максим', description: 'Имя пользователя' })
  first_name?: string;

  @ApiPropertyOptional({ default: 'Максимыч', description: 'Фамилия пользователя' })
  last_name?: string;

  @ApiPropertyOptional({ default: 'Санкт-Петербург', description: 'Город пользователя' })
  city?: string;

  @ApiPropertyOptional({ default: 'Краткое описание пользователя', description: 'Информация о пользователе' })
  about?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  avatar?: any;

  @ApiPropertyOptional({ default: 'IT, Frontend', description: 'Ключевые слова' })
  keywords?: string;

  @ApiPropertyOptional({
    enum: EUserJobFormat,
    description: 'Формат работы',
    default: EUserJobFormat.ft001,
    required: true,
  })
  @IsEnum(EUserJobFormat, { each: true })
  job_format?: EUserJobFormat;

  @ApiPropertyOptional({
    enum: EUserJobExperience,
    description: 'нет опыта',
    default: EUserJobExperience.et004,
    required: true,
  })
  @IsEnum(EUserJobExperience, { each: true })
  job_experience?: EUserJobExperience;

  @ApiPropertyOptional({
    enum: EUserProjectInvolvement,
    description: 'Постоянная занятость',
    default: EUserProjectInvolvement.pit001,
    required: true,
  })
  @IsEnum(EUserProjectInvolvement, { each: true })
  project_involvement?: EUserProjectInvolvement;

  @ApiPropertyOptional({
    default: [
      { name: EUserQualification.qt001, year: 2024 },
      { name: EUserQualification.qt002, year: 2023 },
    ],
    description: 'Квалификация пользователя',
  })
  @Transform(validateArrayOfQualification)
  qualifications?: IQualification[];

  @ApiPropertyOptional({
    default: [
      { url: 'https://www.google.com', name: 'Google' },
      { url: 'https://www.yandex.ru', name: 'Yandex' },
    ],
    description: 'Ссылки',
  })
  @Transform(validateArrayOfLinks)
  links?: ILink[];

  @ApiPropertyOptional({ default: true, description: 'Скрыть номер телефона пользователя' })
  is_hide_phone?: boolean;

  @ApiPropertyOptional({ default: 'Веб-разработка, Анализ данных', description: 'Программы пользователя' })
  @Transform(validateArrayOfString)
  programs?: string;

  @ApiPropertyOptional({ default: 'Бэкенд-разработка', description: 'Специализация пользователя' })
  specialization?: string;
}
