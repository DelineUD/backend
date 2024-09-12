import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsUniqueArray } from '@shared/decorators/unique-array.decorator';
import { validateArrayOfFiles } from '@shared/validators/validateArrayOfFiles';
import { EFileType } from '@shared/interfaces/file.interface';
import { EPostGroup } from '@shared/consts/post-group.enum';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';
import { PostDto } from './post.dto';

export class CreatePostDto extends PartialType(PostDto) {
  @ApiProperty({ default: 'Текст' })
  @IsString()
  pText: string;

  @ApiProperty({ default: [EPostGroup.pg001], required: true })
  @IsEnum(EPostGroup, { each: true })
  @IsUniqueArray({ message: 'Each value in group must be unique' })
  groups: EPostGroup[];

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
