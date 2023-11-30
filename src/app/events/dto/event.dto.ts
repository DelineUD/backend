import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsString() authorId: string;
  @IsString() hText: string;
  @IsDate() startDate: Date;
  @IsString() hImg?: string;

  @IsOptional() @IsString() addr?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() access?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsString() bodyText?: string;
  @IsOptional() @IsArray() favor?: Array<string>;
  @IsOptional() @IsArray() iGo?: Array<string>;
  @IsOptional() @IsArray() notGo?: Array<string>;
  @IsOptional() @IsDate() stopDate?: Date;
}
