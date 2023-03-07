import { ApiProperty } from '@nestjs/swagger';

export class GetResidentParamsDto {
  @ApiProperty()
  _id: string;
}
