import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsUniqueArray } from '@shared/decorators/unique-array.decorator';
import { validateArrayOfFiles } from '@shared/validators/validateArrayOfFiles';
import { EFileType } from '@shared/interfaces/file.interface';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';
import { GroupFilterKeys } from '@app/filters/consts';
import { PostDto } from './post.dto';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Текст' })
  @IsString()
  pText: string;

  @ApiProperty({ default: [GroupFilterKeys.pf001], required: true })
  @IsEnum(GroupFilterKeys, { each: true })
  @IsUniqueArray({ message: 'Each value in group must be unique' })
  groups: GroupFilterKeys[];

  @ApiProperty({ default: 'false' })
  @IsOptional()
  @IsBooleanString()
  publishInProfile: boolean;

  @ApiProperty({ default: [`{"type": "${EFileType.Image}", "url": ""}`], required: false })
  @IsOptional()
  @Transform(validateArrayOfFiles)
  files?: IPostFile[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsOptional()
  uploadedFiles?: any[];
}
