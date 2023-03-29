import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateResidentDto {
  @IsNumber()
  phone?: number;

  @IsEmail()
  email?: string;

  @IsString()
  quality?: string;

  @IsString()
  instagram?: string;

  @IsString()
  vk?: string;

  @IsString()
  bio?: string;

  @IsString()
  city?: string;

  @IsNumber()
  age?: number;

  @IsString()
  price?: string;

  @IsBoolean()
  readyToRemote?: boolean;

  @IsBoolean()
  readyToWorkNow?: boolean;
}
