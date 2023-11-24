import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../upload/upload.service';
import { CreatePostDto } from './dto/create.post.dto';
import { DeletePostDto } from './dto/delete.post.dto';
import { GetPostParamsDto } from './dto/get-post-params.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { CommentListEntity } from './entities/comment-list.entity';
import { CreatePostEntity } from './entities/create-post.entity';
import { DeleteCommentPostEntity } from './entities/delete-comment.entity';
import { DeletePostEntity } from './entities/delete-posts.entity';
import { PostEntity } from './entities/posts.entity';
import { UpdateCommentPostEntity } from './entities/update-comment.entity';
import { UpdatePostEntity } from './entities/update-posts.entity';
import { IcPosts } from './interfaces/posts.comments.interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IPosts } from './interfaces/posts.interface';
import { PostCreateCommentDto } from './dto/post-create-comment.dto';

@ApiTags('Posts')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private PostsService: PostsService) {}

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список постов',
    type: [PostEntity],
  })
  public async getList(
    @Request() data: any,
    @Query('search') search: string,
    @Query('lastIndex') lastIndex: any,
    @Query('group') group: any,
  ): Promise<any> {
    console.log(group);
    return await this.PostsService.getPostsList(data, search, lastIndex, group);
  }

  @Post('create')
  @ApiBody({
    description: 'Новывй пост',
    type: CreatePostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно создан',
    type: CreatePostEntity,
  })
  public async create(
    @Body()
    createPostDto: CreatePostDto,
  ): Promise<IcPosts> {
    return await this.PostsService.create(createPostDto);
  }

  @Post('update')
  @ApiBody({
    description: 'Обновление поста',
    type: UpdatePostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно обновлен',
    type: UpdatePostEntity,
  })
  public async update(
    @Body()
    updatePostDto: UpdatePostDto,
  ): Promise<IcPosts> {
    const result: IcPosts = await this.PostsService.update(updatePostDto);

    if (!result) {
      throw new HttpException('Запись не найдена!', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Delete('delete')
  @ApiBody({
    description: 'Удаление поста',
    type: DeletePostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно удаленн',
    type: DeletePostEntity,
  })
  public async delete(
    @Body()
    deletePostDto: DeletePostDto,
  ): Promise<IPosts> {
    const result: IcPosts = await this.PostsService.delete(deletePostDto);

    if (!result) {
      throw new HttpException('Запись не найдена!', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост по id',
    type: PostEntity,
  })
  @ApiParam({ name: '_id', required: true })
  async getById(@Param() params: GetPostParamsDto, @Request() data: any): Promise<IPosts> {
    return await this.PostsService.getPostById(params, data);
  }

  @Post('upload-images')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Загрузка картинок',
    type: PostEntity,
  })
  @UseInterceptors(
    FilesInterceptor('image', 4, {
      storage: diskStorage({
        destination: process.env.STATIC_PATH_FOLDER,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async upImages(
    @Body()
    createPostDto: CreatePostDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<IcPosts> {
    const response = files.filter(Boolean).map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      url: `${process.env.STATIC_PATH}/${file.filename}`,
    }));
    return await this.PostsService.upImages(createPostDto, response);
  }

  @Post(':_id/view')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Просмотры',
    type: PostEntity,
  })
  async addView(@Param() params: any, @Request() data: { user: { _id: string } }): Promise<any> {
    return await this.PostsService.addView(params, data.user._id);
  }

  @Post(':_id/like')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Лайки',
    type: PostEntity,
  })
  async liked(
    @Param() params: GetPostParamsDto,
    @Request()
    data: {
      user: { _id: string };
    },
  ): Promise<GetPostParamsDto> {
    return await this.PostsService.liked(params, data.user._id);
  }

  /**
   * Создание нового комментария к посту.
   * @param createComments - Данные для создания поста.
   * @param params - Параметры запроса.
   * @param data - Данные запроса.
   * @returns Созданный комментарий.
   */
  @Post(':_id/comments')
  @UsePipes(new ValidationPipe())
  @ApiBody({
    description: 'Новый комментарий',
    type: PostCreateCommentDto,
  })
  public async createComment(
    @Body() createComments: PostCreateCommentDto,
    @Param() params: GetPostParamsDto,
    @Request() { user }: { user: { _id: string } },
  ): Promise<IcPosts> {
    return await this.PostsService.createComment(createComments, params, user._id);
  }

  @Get(':_id/comments')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список комментариев',
    type: CommentListEntity,
  })
  public async commentList(
    @Param() params: GetPostParamsDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Request() data: unknown,
  ): Promise<unknown> {
    return await this.PostsService.commentList(params);
  }

  @Post(':_id_post/like-comment/:_id_comment/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Лайки',
    type: CommentListEntity,
  })
  async commentLiked(
    @Param('_id_post') post_id: string,
    @Param('_id_comment')
    comment_id: string,
    @Request() data: { user: { _id: string } },
  ): Promise<GetPostParamsDto> {
    return await this.PostsService.commentLiked(post_id, comment_id, data.user._id);
  }

  @Post(':_id_post/update-comment/:_id_comment')
  @ApiBody({
    description: 'Обновление коммента',
    type: UpdateCommentPostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Комментарий успешно обновлен',
    type: UpdateCommentPostEntity,
  })
  public async updateComment(
    @Param('_id_post') post_id: any,
    @Param('_id_comment')
    comment_ID: any,
    @Body() updateComment: IcPosts,
    @Request() data: any,
  ): Promise<IcPosts> {
    const result: IcPosts = await this.PostsService.updateComment(
      comment_ID,
      updateComment,
      data.user._id,
    );

    if (!result) {
      throw new HttpException('Запись не найдена!', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Delete(':_id_post/delete-comment/:_id_comment')
  @ApiBody({
    description: 'Удаление поста',
    type: DeleteCommentPostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пост успешно удаленн',
    type: DeleteCommentPostEntity,
  })
  public async deleteComment(
    @Param('_id_post') post_id: any,
    @Param('_id_comment')
    comment_ID: any,
    @Request() data: any,
  ): Promise<any> {
    const result: IcPosts = await this.PostsService.deleteComment(
      comment_ID,
      data.user._id,
      post_id,
    );

    if (!result) {
      throw new HttpException('Запись не найдена!', HttpStatus.BAD_REQUEST);
    }

    return result;
  }
}
