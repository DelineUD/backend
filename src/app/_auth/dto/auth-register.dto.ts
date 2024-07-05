import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { UserCreateDto } from '@app/_users/dto/user-create.dto';
import { EUserStatus } from '@shared/consts/user-status.enum';
import { EUserFormat } from '@shared/consts/user-format.enum';

export class AuthRegisterDto extends PartialType(UserCreateDto) {
  @ApiProperty({ example: '+79992456800', description: 'Номер телефона пользователя' })
  phone: string;

  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта пользователя' })
  email: string;

  @ApiProperty({ example: 'root', description: 'Пароль пользователя' })
  password: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ example: '1990-01-01', description: 'Дата рождения пользователя' })
  birthday: string;

  @ApiProperty({ example: 'Москва', description: 'Город пользователя' })
  city: string;

  @ApiPropertyOptional({ example: 'Россия', description: 'Страна пользователя' })
  country?: string;

  @ApiProperty({ enum: EUserStatus, description: 'Статус пользователя' })
  status: EUserStatus;

  @ApiProperty({ enum: EUserFormat, description: 'Предпочтение пользователя к удаленной работе' })
  format: EUserFormat;

  @ApiProperty({ example: 'Магистр компьютерных наук', description: 'Квалификация пользователя' })
  qualification: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  avatar?: any;

  @ApiPropertyOptional({ example: 'Краткое описание пользователя', description: 'Информация о пользователе' })
  about?: string;

  @ApiPropertyOptional({ example: '@telegram_username', description: 'Telegram пользователя' })
  telegram?: string;

  @ApiPropertyOptional({ example: '@instagram_username', description: 'Instagram пользователя' })
  instagram?: string;

  @ApiPropertyOptional({ example: '@vk_username', description: 'VK пользователя' })
  vk?: string;

  @ApiPropertyOptional({ example: 'https://userwebsite.com', description: 'Сайт пользователя' })
  site?: string;

  @ApiPropertyOptional({ example: true, description: 'Скрыть номер телефона пользователя' })
  is_hide_phone?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Скрыть дату рождения пользователя' })
  is_hide_birthday?: boolean;

  @ApiPropertyOptional({ example: 'JavaScript, Python', description: 'Курсы пользователя' })
  courses?: string;

  @ApiPropertyOptional({ example: 'Веб-разработка, Анализ данных', description: 'Программы пользователя' })
  programs?: string;

  @ApiPropertyOptional({ example: 'Бэкенд-разработка', description: 'Специализации пользователя' })
  specializations?: string;

  @ApiPropertyOptional({ example: 'Node.js, Django', description: 'Узкие специализации пользователя' })
  narrow_specializations?: string;
}
