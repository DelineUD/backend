import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { GroupFilterKeys } from '@app/filters/consts';
import { PostDto } from './post.dto';
import { IsUniqueArray } from '@shared/decorators/unique-array.decorator';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsOptional()
  @IsString()
  pText?: string;

  @ApiProperty({ default: [GroupFilterKeys.pf001] })
  @IsOptional()
  @IsEnum(GroupFilterKeys, { each: true })
  @IsArray()
  @IsUniqueArray({ message: 'Each value in group must be unique' })
  group?: GroupFilterKeys[];

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  publishInProfile?: boolean;

  @ApiProperty({ default: [] })
  @IsOptional()
  pImg?: string[];
}
