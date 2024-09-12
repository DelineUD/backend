import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { groupFilters } from '@app/filters/consts';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';
import { validateArrayOfFiles } from '@shared/validators/validateArrayOfFiles';
import { IsUniqueArray } from '@shared/decorators/unique-array.decorator';
import { EFileType } from '@shared/interfaces/file.interface';
import { PostDto } from './post.dto';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: string;

  @ApiProperty({ default: 'Текст', required: false })
  @IsOptional()
  @IsString()
  pText?: string;

  @ApiProperty({ default: [groupFilters[0].name], required: false })
  @IsOptional()
  @IsUniqueArray({ message: 'Each value in group must be unique' })
  groups?: string[];

  @ApiProperty({ default: 'false', required: false })
  @IsOptional()
  @IsBooleanString()
  publishInProfile?: boolean;

  @ApiProperty({ default: [`{"type": "${EFileType.Image}", "url": ""}`], required: false })
  @IsOptional()
  @Transform(validateArrayOfFiles)
  files?: IPostFile[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsOptional()
  uploadedFiles?: any[];
}
