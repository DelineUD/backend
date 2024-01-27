import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsBooleanString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PostDto } from './post.dto';
import { GroupFilterKeys } from '@app/filters/consts';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsOptional()
  @IsString()
  pText?: string;

  @ApiProperty({ default: GroupFilterKeys.pf001 })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  publishInProfile?: boolean;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pImg?: Array<string>;
}
