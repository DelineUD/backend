import {
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { EUserStatus } from '@shared/consts/user-status.enum';
import { EUserFormat } from '@shared/consts/user-format.enum';

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
  @IsOptional()
  country?: string;
  @IsEnum(EUserStatus)
  status: EUserStatus;
  @IsEnum(EUserFormat)
  format: EUserFormat;
  @IsString()
  qualification: string;
  @IsString()
  @IsOptional()
  avatar?: any;
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
  @IsBooleanString()
  @IsOptional()
  is_hide_phone?: boolean;
  @IsBooleanString()
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
