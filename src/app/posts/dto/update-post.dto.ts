import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsMongoId, IsOptional, IsString } from 'class-validator';

import { GroupFilterKeys } from '@app/filters/consts';
import { PostDto } from './post.dto';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
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
  @IsBooleanString()
  publishInProfile?: boolean;

  @ApiProperty({ default: [] })
  @IsOptional()
  pImg?: string[];
}
