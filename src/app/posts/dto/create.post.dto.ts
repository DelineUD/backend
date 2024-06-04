import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { GroupFilterKeys } from '@app/filters/consts';
import { PostDto } from './post.dto';
import { IsUniqueArray } from '@shared/decorators/unique-array.decorator';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Текст' })
  @IsString()
  pText: string;

  @ApiProperty({ default: [GroupFilterKeys.pf001] })
  @IsOptional()
  @IsEnum(GroupFilterKeys, { each: true })
  @IsArray()
  @IsUniqueArray({ message: 'Each value in group must be unique' })
  groups?: GroupFilterKeys[];

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  publishInProfile?: boolean;

  @ApiProperty({ default: [] })
  @IsOptional()
  pImg?: string[];
}
