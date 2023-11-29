import { ApiProperty } from '@nestjs/swagger';

export class IPostsFindQuery {
  @ApiProperty({ default: '', required: false })
  search: string;
  @ApiProperty({ default: '', required: false })
  lastIndex: string;
  @ApiProperty({ default: '', required: false })
  group: string;
}
