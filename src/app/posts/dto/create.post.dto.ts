import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

import { GroupFilterKeys } from '@app/filters/consts';
import { PostDto } from './post.dto';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Текст' })
  @IsString()
  pText: string;

  @ApiProperty({ default: GroupFilterKeys.pf001 })
  @IsOptional()
  @IsString()
  group?: GroupFilterKeys;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBooleanString()
  publishInProfile?: boolean;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: Express.Multer.File[];
}
