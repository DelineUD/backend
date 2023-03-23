import { Controller, Get, Post, HttpStatus, UseGuards, Body, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPosts } from './interfaces/posts.interface';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { CreateStatus } from './interfaces/create-status.interface';

@Controller('posts')
export class PostsController {

    constructor(private PostsService: PostsService) {}

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  public async gettList(): Promise<IPosts[]> {
    const result = await this.PostsService.getPostsList();
    return result;
  }
  
  @Post('create-or-update')
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Body() createPostDto: PostDto,
  ): Promise<PostDto> {
    const result: PostDto = await this.PostsService.create(
      createPostDto,
    );

    if (!result) {
      throw new HttpException("Some error", HttpStatus.BAD_REQUEST);
    }

    return result;
  }

}
