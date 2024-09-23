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

import { IEducation, ILink, IQualification } from '@/app/users/interfaces/user.interface';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';

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
  @IsOptional()
  job_format: EUserJobFormat;
  @IsEnum(EUserJobFormat)
  @IsOptional()
  job_experience: EUserJobExperience;
  @IsEnum(EUserProjectInvolvement)
  @IsOptional()
  project_involvement: EUserProjectInvolvement;
  @IsArray()
  @IsOptional()
  qualifications?: IQualification[];
  @IsArray()
  @IsOptional()
  education?: IEducation[];
  @IsString()
  @IsOptional()
  programs?: string;
  @IsString()
  @IsOptional()
  specialization?: string;
  @IsBooleanString()
  @IsOptional()
  is_hide_phone?: boolean;
  @IsString()
  @IsOptional()
  getcourse_id?: string;
}
