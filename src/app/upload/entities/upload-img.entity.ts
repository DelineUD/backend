import { ApiProperty } from '@nestjs/swagger';

export class UploadImgEntity {
  @ApiProperty({
    example: 'img файл',
    description: 'загрузка картинки',
  })
  image: string;
}
