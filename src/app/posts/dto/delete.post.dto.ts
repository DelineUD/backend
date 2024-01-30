import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class DeletePostDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  postId: Types.ObjectId;
}
