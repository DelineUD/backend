import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IPostsFindParams {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  postId: string;
}
