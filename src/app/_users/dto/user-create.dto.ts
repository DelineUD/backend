import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { StatusFilterKeys } from '@app/filters/consts';

export class UserCreateDto {
  @IsPhoneNumber('RU')
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsDateString()
  birthday: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsEnum(StatusFilterKeys)
  status: StatusFilterKeys;
  @IsBoolean()
  ready_communicate: boolean;
  @IsBoolean()
  remote_work: boolean;
  @IsString()
  @IsOptional()
  qualification?: string;
  @IsString()
  @IsOptional()
  about?: string;
  @IsString()
  @IsOptional()
  telegram?: string;
  @IsString()
  @IsOptional()
  instagram?: string;
  @IsString()
  @IsOptional()
  vk?: string;
  @IsString()
  @IsOptional()
  site?: string;
  @IsBoolean()
  @IsOptional()
  is_hide_phone?: boolean;
  @IsBoolean()
  @IsOptional()
  is_hide_birthday?: boolean;
  @IsString()
  @IsOptional()
  courses?: string;
  @IsString()
  @IsOptional()
  programs?: string;
  @IsString()
  @IsOptional()
  specializations?: string;
  @IsString()
  @IsOptional()
  narrow_specializations?: string;
}
