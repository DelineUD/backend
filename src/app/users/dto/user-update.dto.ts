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

import { ILink, IQualification } from '@app/users/interfaces/user.interface';
import { EUserJobFormat } from '@shared/consts/user-format.enum';
import { EUserJobExperience } from '@shared/consts/user-experience.enum';
import { EUserProjectInvolvement } from '@shared/consts/user-involvement.enum';

export class UserUpdateDto {
  @IsPhoneNumber('RU')
  @IsOptional()
  phone?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  first_name?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  last_name?: string;
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
  job_format?: EUserJobFormat;
  @IsEnum(EUserJobFormat)
  @IsOptional()
  job_experience?: EUserJobExperience;
  @IsEnum(EUserProjectInvolvement)
  @IsOptional()
  project_involvement?: EUserProjectInvolvement;
  @IsArray()
  @IsOptional()
  qualifications?: IQualification[];
  @IsString()
  @IsOptional()
  programs?: string;
  @IsString()
  @IsOptional()
  specialization?: string;
  @IsBooleanString()
  @IsOptional()
  is_hide_phone?: boolean;
}
