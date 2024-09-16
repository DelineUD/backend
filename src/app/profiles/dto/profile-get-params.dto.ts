import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ProfileGetParamsDto {
  @ApiProperty({ default: '' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
