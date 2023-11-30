import {
  IsBooleanString,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserDto {
  // Personal Information
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: number;
  @IsOptional() @IsString() id?: string;
  @IsOptional()
  @IsString()
  password?: string;
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
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday?: Date;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsString()
  cntry?: string;

  // Contact Information
  @IsOptional()
  @IsString()
  city_ru?: string;
  @IsOptional()
  @IsString()
  citynru?: string;

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
  @IsString()
  ready_communicate?: boolean;
  @IsOptional()
  @IsBooleanString()
  remote_work?: boolean;
  @IsOptional()
  @IsString()
  status?: string;

  // Social Media
  @IsOptional()
  @IsNumberString()
  service_cost?: number;
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
  @IsBooleanString()
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
