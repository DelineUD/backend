import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/posts.entity';
import { IPosts } from './interfaces/posts.interface';
import { PostsService } from './posts.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('posts')
@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private PostsService: PostsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список постов',
    type: [PostEntity],
  })
  public async gettList(): Promise<IPosts[]> {
    const result = await this.PostsService.getPostsList();
    return result;
  }

  @Post('create')
  @ApiBody({
    description: 'Новывй пост',
    type: PostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно создан',
    type: PostEntity,
  })
  public async create(@Body() createPostDto: PostDto): Promise<PostDto> {
    const result: PostDto = await this.PostsService.create(createPostDto);

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('update')
  @ApiBody({
    description: 'Обновление поста',
    type: PostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно обновлен',
    type: PostEntity,
  })
  public async update(@Body() updatePostDto: PostDto): Promise<PostDto> {
    const result: PostDto = await this.PostsService.update(updatePostDto);

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Delete('delete')
  @ApiBody({
    description: 'Удаление поста',
    type: PostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно удаленн',
    type: PostEntity,
  })
  public async delete(@Body() deletePostDto: PostDto): Promise<PostDto> {
    const result: PostDto = await this.PostsService.delete(deletePostDto);

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
    }

    return result;
  }
}
