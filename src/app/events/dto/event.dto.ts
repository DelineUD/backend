import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsString() hText: string;
  @IsOptional()
  @IsDateString()
  startDate: string;
  @IsOptional()
  @IsDateString()
  stopDate: string;
  @IsOptional()
  @IsString()
  hImg?: string;
  @IsOptional()
  @IsString()
  addr?: string;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  access?: string;
  @IsOptional()
  @IsString()
  format?: string;
  @IsOptional()
  @IsString()
  bodyText?: string;
  @IsOptional()
  @IsArray()
  favor?: Array<string>;
  @IsOptional()
  @IsArray()
  iGo?: Array<string>;
  @IsOptional()
  @IsArray()
  notGo?: Array<string>;
}
