import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class IPostsCommentsFindParams {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: Types.ObjectId;

  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  commentId: Types.ObjectId;
}

export class IPostsCommentsFindQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  desc?: string | undefined;
}
