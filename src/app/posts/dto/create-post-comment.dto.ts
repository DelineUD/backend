import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { PostCommentDto } from '@app/posts/dto/post-comment.dto';
import { EFileType } from '@shared/interfaces/file.interface';
import { validateArrayOfFiles } from '@shared/validators/validateArrayOfFiles';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';

export class CreatePostCommentDto extends PartialType(PostCommentDto) {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: string;

  @ApiProperty({ default: 'Текст' })
  @IsString()
  cText: string;

  @ApiProperty({ default: [`{"type": "${EFileType.Image}", "url": ""}`], required: false })
  @IsOptional()
  @Transform(validateArrayOfFiles)
  files?: IPostFile[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsOptional()
  uploadedFiles?: any[];
}
