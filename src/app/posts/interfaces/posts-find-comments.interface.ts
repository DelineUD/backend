import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IPostsFindComments {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId?: string;
}
