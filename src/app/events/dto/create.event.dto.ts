import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { EventDto } from '@app/events/dto/event.dto';

export class CreateEventDto extends PartialType(EventDto) {
  @ApiProperty()
  @IsMongoId()
  author: Types.ObjectId;

  @ApiProperty()
  @IsString()
  hText: string;

  @ApiProperty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsString()
  stopDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addr?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  access?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bodyText?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  favor?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  iGo?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  notGo?: string[];
}
