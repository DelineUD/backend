import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateBooleanOfString } from '@shared/validators/validateBooleanOfString';
import { StatusFilterKeys } from '@app/filters/consts';
import { validateArrayOfString } from '@shared/validators/validateArrayOfString';

export class UserDto {
  @IsString()
  id: string;

  // Personal Information
  @IsEmail()
  email: string;
  @IsPhoneNumber('RU')
  phone: string;
  @IsOptional()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  first_name: string;
  @IsOptional()
  @IsString()
  last_name?: string;
  @IsOptional()
  @IsString()
  birthday?: string;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  gender?: string;

  // Contact Information
  @IsOptional()
  @IsString()
  country: string;
  @IsOptional()
  @IsString()
  city: string;

  // Additional Information
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  other?: string;
  @IsOptional()
  @IsString()
  education?: string;
  @IsOptional()
  @IsString()
  qualification?: string;
  @IsOptional()
  @Transform(validateBooleanOfString)
  ready_communicate: boolean;
  @IsOptional()
  @Transform(validateBooleanOfString)
  remote_work: boolean;
  @IsOptional()
  @Transform(validateBooleanOfString)
  hide_phone: boolean;
  @IsOptional()
  @IsString()
  status: StatusFilterKeys;
  @IsOptional()
  @IsString()
  qualification_color?: string;

  // Social Media
  @IsOptional()
  @IsString()
  site?: string;
  @IsOptional()
  @IsString()
  instagram?: string;
  @IsOptional()
  @IsString()
  telegram?: string;
  @IsOptional()
  @IsString()
  vk?: string;

  // Courses
  @IsOptional()
  @Transform(validateArrayOfString)
  courses_new_app?: string;

  // Programs
  @IsOptional()
  @Transform(validateArrayOfString)
  programs_new_app?: string;

  // Specializations
  @IsOptional()
  @Transform(validateArrayOfString)
  specialization_new_app?: string;

  // Narrow Specializations
  @IsOptional()
  @Transform(validateArrayOfString)
  narrow_spec_new_app?: string;
}
