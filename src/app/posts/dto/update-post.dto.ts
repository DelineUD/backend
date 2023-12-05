import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PostDto } from './post.dto';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsOptional()
  @IsString()
  pText?: string;

  @ApiProperty({ default: 'Группа 1' })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pImg?: Array<string>;
}
