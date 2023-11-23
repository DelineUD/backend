import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class PostCreateCommentDto {
  @IsString()
  @ApiProperty({ default: '655cf785a1fc023840786396' })
  postID?: string;

  @IsString()
  @ApiProperty({ default: '65575899efa334db8c725608' })
  authorId?: string;

  @IsString()
  @ApiProperty({ default: 'Аватар' })
  authorAvatar?: string;

  @IsString()
  @ApiProperty({ default: 'Текст комментария...' })
  cText?: string;

  @IsArray()
  @ApiProperty({ default: [] })
  likes?: Array<string>;

  @IsArray()
  @ApiProperty({ default: [] })
  countLikes?: number;

  @IsBoolean()
  @ApiProperty({ default: false })
  isLiked?: boolean;

  @IsString()
  @ApiProperty({ default: 'Картинка' })
  cImg?: Array<string>;
}
