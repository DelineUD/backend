import {
  IsBooleanString,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  // Personal Information
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: number;
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
