import { Types } from 'mongoose';
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsMongoId() @IsNotEmpty() eventId: Types.ObjectId;
  @IsMongoId() @IsNotEmpty() author: Types.ObjectId;
  @IsString() @IsNotEmpty() hText: string;
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
