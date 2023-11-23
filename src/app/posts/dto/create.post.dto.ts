import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ default: '' })
  authorId?: string;

  @IsString()
  @ApiProperty({ default: 'Текст поста' })
  pText?: string;

  @IsString()
  @ApiProperty({ default: 'Группа 1' })
  group?: string;

  @ApiProperty({ default: 'Картинка' })
  @IsString()
  pImg?: Array<string>;
}
