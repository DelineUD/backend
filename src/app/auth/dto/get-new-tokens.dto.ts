import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class GetNewTokensDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  readonly userId: Types.ObjectId;
  @ApiProperty({ default: '' })
  @IsString()
  readonly headers: any;
}
