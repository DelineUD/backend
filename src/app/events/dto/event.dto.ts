import { Types } from 'mongoose';
import { IsArray, IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsMongoId() eventId: Types.ObjectId;
  @IsMongoId() author: Types.ObjectId;
  @IsString() hText: string;
  @IsOptional() @IsDate() startDate?: Date;
  @IsOptional() @IsString() hImg?: string;
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
