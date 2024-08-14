import {
  IsArray,
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';
import { ILink } from '@app/_users/interfaces/user.interface';

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
  @IsString()
  @IsOptional()
  avatar?: string;
  @IsString()
  @IsOptional()
  city?: string;
  @IsString()
  @IsOptional()
  about?: string;
  @IsArray()
  @IsOptional()
  links?: ILink[];
  @IsString()
  @IsOptional()
  keywords?: string;
  @IsEnum(EUserJobFormat)
  job_format: EUserJobFormat;
  @IsEnum(EUserJobFormat)
  job_experience: EUserJobExperience;
  @IsEnum(EUserProjectInvolvement)
  project_involvement: EUserProjectInvolvement;
  @IsString()
  @IsNotEmpty()
  qualification: string;
  @IsString()
  @IsOptional()
  programs?: string;
  @IsString()
  @IsOptional()
  specializations?: string;
  @IsBooleanString()
  @IsOptional()
  is_hide_phone?: boolean;
  @IsString()
  @IsOptional()
  getcourse_id?: string;
}
