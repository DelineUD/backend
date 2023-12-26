import { IsEmail, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { validateStringToBoolean } from '@helpers/validateStringToBoolean';
import { StatusFilterKeys } from '@app/filters/consts';

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
  @IsNumberString()
  vPass?: number;
  @IsOptional()
  @IsString()
  first_name?: string;
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
  country?: string;
  @IsOptional()
  @IsString()
  city?: string;

  // Additional Information
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  education?: string;
  @IsOptional()
  @IsString()
  qualification?: string;
  @IsOptional()
  @Transform(validateStringToBoolean)
  ready_communicate?: boolean;
  @IsOptional()
  @Transform(validateStringToBoolean)
  remote_work?: boolean;
  @IsOptional()
  @IsString()
  status?: StatusFilterKeys;

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

  // Preferences
  @IsOptional()
  @Transform(validateStringToBoolean)
  hide_phone?: boolean;
  @IsOptional()
  @IsString()
  qualification_color?: string;

  // Courses
  @IsOptional()
  @IsString()
  courses_new_app?: string;

  // Programs
  @IsOptional()
  @IsString()
  programs_new_app?: string;

  // Specializations
  @IsOptional()
  @IsString()
  specialization_new_app?: string;

  // Narrow Specializations
  @IsOptional()
  @IsString()
  narrow_spec_new_app?: string;
}
