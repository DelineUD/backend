import { ApiProperty } from '@nestjs/swagger';

export class GetPostParamsDto {
  @ApiProperty({ default: '655cf785a1fc023840786396' })
  _id?: string;
  views?: number;
}
