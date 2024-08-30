import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { UserCreateDto } from '@/app/users/dto/user-create.dto';
import { ILink, IQualification } from '@/app/users/interfaces/user.interface';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';
import { EUserQualification } from '@shared/consts/user-qualification.enum';
import { validateArrayOfLinks } from '@shared/validators/validateArrayOfLinks';
import { validateArrayOfQualification } from '@shared/validators/validateArrayOfQualification';
import { validateArrayOfString } from '@shared/validators/validateArrayOfString';
import { validatePhoneNumber } from '@shared/validators/validatePhoneNumber';

export class AuthRegisterDto extends PartialType(UserCreateDto) {
  @ApiProperty({ default: '+79992456800', description: 'Номер телефона пользователя' })
  @Transform(validatePhoneNumber)
  phone: string;

  @ApiProperty({ default: 'user@example.com', description: 'Электронная почта пользователя' })
  email: string;

  @ApiProperty({ default: 'root', description: 'Пароль пользователя' })
  password: string;

  @ApiProperty({ default: 'Максим', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ default: 'Максимыч', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ default: 'Санкт-Петербург', description: 'Город пользователя' })
  city?: string;

  @ApiPropertyOptional({ default: 'Краткое описание пользователя', description: 'Информация о пользователе' })
  about?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  avatar?: any;

  @ApiProperty({ default: 'IT, Frontend', description: 'Ключевые слова' })
  keywords?: string;

  @ApiProperty({
    enum: EUserJobFormat,
    description: 'Формат работы',
    default: EUserJobFormat.ft001,
    required: true,
  })
  @IsEnum(EUserJobFormat, { each: true })
  job_format: EUserJobFormat;

  @ApiProperty({
    enum: EUserJobExperience,
    description: 'нет опыта',
    default: EUserJobExperience.et004,
    required: true,
  })
  @IsEnum(EUserJobExperience, { each: true })
  job_experience: EUserJobExperience;

  @ApiProperty({
    enum: EUserProjectInvolvement,
    description: 'Постоянная занятость',
    default: EUserProjectInvolvement.pit001,
    required: true,
  })
  @IsEnum(EUserProjectInvolvement, { each: true })
  project_involvement: EUserProjectInvolvement;

  @ApiProperty({
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
