import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class PostsHideDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsOptional()
  authorId?: string;

  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsOptional()
  postId?: string;
}
