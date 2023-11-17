import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetNewTokensDto {
  @IsString()
  @ApiProperty({ type: String, default: '' })
  readonly refreshToken: string;
}
