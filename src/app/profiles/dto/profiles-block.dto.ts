import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfilesBlockDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  profileId: string;
}
