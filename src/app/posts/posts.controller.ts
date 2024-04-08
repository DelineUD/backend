import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { fileStorage } from '@shared/storage';
import { UserId } from '@shared/decorators/user-id.decorator';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';
import { imageFileFilter } from '@utils/imageFileFilter';
import { UpdatePostCommentDto } from '@app/posts/dto/update-post-comment.dto';
import { DeletePostCommentDto } from '@app/posts/dto/delete-post-comment.dto';
import { IPostsFindQuery } from '@app/posts/interfaces/post-find-query';
import { IPostsFindParams } from '@app/posts/interfaces/posts-find.interface';
import { IPostsCommentsFindParams, IPostsCommentsFindQuery } from '@app/posts/interfaces/posts-comments-find.interface';

import { CreatePostDto } from './dto/create.post.dto';
import { DeletePostDto } from './dto/delete.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsHideDto } from './dto/posts-hide.dto';
import { ICPosts, ICPostsResponse } from './interfaces/posts.comments.interface';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { IPostsResponse } from './interfaces/posts.interface';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { ILike } from '@app/posts/interfaces/like.interface';

@ApiTags('Posts')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  /**
   * Создание поста.
   * @param userId - id пользователя.
   * @param createPostDto - Данные для создания поста.
   * @return - Созданный пост
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: fileStorage,
      fileFilter: imageFileFilter,
    }),
  )
  public async create(@UserId() userId: Types.ObjectId, @Body() createPostDto: CreatePostDto): Promise<IPostsResponse> {
    return await this.postsService.create(userId, createPostDto);
  }

  constructor(private postsService: PostsService) {}

  /**
   * Удаление поста.
   * @param userId - id пользователя.
   * @param deletePostDto - Данные для удаления поста.
   * @return - Удаленные данные
   */
  @Delete('delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async delete(
    @UserId() userId: Types.ObjectId,
    @Body() deletePostDto: DeletePostDto,
  ): Promise<IRemoveEntity<string>> {
    return await this.postsService.delete(userId, deletePostDto);
  }

  /**
   * Обновление поста.
   * @param userId - id пользователя.
   * @param updatePostDto - Данные для обноввления поста.
   * @param files - Файлы поста (картинки).
   * @return - Обновленный пост
   */
  @Post('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: fileStorage,
      fileFilter: imageFileFilter,
    }),
  )
  public async update(
    @UserId() userId: Types.ObjectId,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IPostsResponse> {
    return await this.postsService.update(userId, updatePostDto, files);
  }

  /**
   * Нахожднение всех постов.
   * @param userId - id пользователя.
   * @param queryParams - Данные для нахождения поста.
   * @return - Список постов
   */
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async findAll(
    @UserId() userId: Types.ObjectId,
    @Query() queryParams: IPostsFindQuery,
  ): Promise<IPostsResponse[]> {
    return await this.postsService.findAll(userId, queryParams);
  }

  /**
   * Получние поста по id.
   * @param userId - id пользователя.
   * @param params - Данные для нахождения поста.
   * @returns - Пост.
   */
  @Get(':postId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({ name: 'postId' })
  async getById(@UserId() userId: Types.ObjectId, @Param() params: IPostsFindParams): Promise<IPostsResponse> {
    return await this.postsService.findPostById(userId, params);
  }

  /**
   * Добавление просмотров для поста.
   * @param userId - id пользователя.
   * @param params - { _id: системный идентификатор поста }.
   * @returns - Количество просмотров.
   */
  @Patch(':postId/view')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'Системный идентификатор поста',
  })
  async addView(@UserId() userId: Types.ObjectId, @Param() params: IPostsFindParams): Promise<number> {
    return await this.postsService.addView(userId, params);
  }

  /**
   * Лайк на пост.
   * @param userId - id пользователя.
   * @param params - Данные для нахождения поста.
   * @returns - Обновленный пост.
   */
  @Patch(':postId/like')
  @UsePipes(new ValidationPipe({ transform: true }))
  async liked(@UserId() userId: Types.ObjectId, @Param() params: IPostsFindParams): Promise<ILike> {
    return await this.postsService.like(userId, params);
  }

  /**
   * Cкрыть запис(и)ь.
   * @param userId - id пользователя.
   * @param dto - { postId?: id записи;  authorId?: id автора}.
   * @returns - void.
   */
  @Patch('hide')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async hideUserPosts(@UserId() userId: Types.ObjectId, @Body() dto: PostsHideDto): Promise<void> {
    return await this.postsService.hide(userId, dto);
  }

  /**
   * Создание нового комментария к посту.
   * @param userId - id пользователя.
   * @param createComments - Данные для создания поста.
   * @returns - Созданный комментарий.
   */
  @Post('comments/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createComment(
    @UserId() userId: Types.ObjectId,
    @Body() createComments: CreatePostCommentDto,
  ): Promise<ICPosts> {
    return await this.postsService.createComment(userId, createComments);
  }

  /**
   * Получение всех комментариев к посту.
   * @param userId - id пользователя.
   * @param params - { postId: системный id поста }.
   * @param query - Параметры для получения комментариев
   * @returns - Комментарии к посту.
   */
  @Get(':postId/comments')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'Системный идентификатор поста',
  })
  public async commentList(
    @UserId() userId: Types.ObjectId,
    @Param() params: IPostsFindParams,
    @Query() query: IPostsCommentsFindQuery,
  ): Promise<ICPostsResponse[]> {
    return await this.postsService.commentList(userId, params, query);
  }

  /**
   * Лайк для комментария к посту.
   * @param userId - id пользователя.
   * @param params - Данные для поиска комментария.
   * @returns - Созданный комментарий.
   */
  @Patch(':postId/comments/:commentId/like')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'Системный идентификатор поста',
  })
  @ApiParam({
    name: 'commentId',
    type: 'string',
    description: 'Системный идентификатор комментария',
  })
  async commentLiked(@UserId() userId: Types.ObjectId, @Param() params: IPostsCommentsFindParams): Promise<ILike> {
    return await this.postsService.commentLike(userId, params);
  }

  /**
   * Обновление комментария поста.
   * @param userId - id пользователя.
   * @param commentId - id комментария.
   * @param updateCommentDto - Данные для обновления комментария.
   * @returns - Обновленный комментарий.
   */
  @Patch('comments/:commentId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'commentId',
    type: 'string',
    description: 'Системный идентификатор комментария',
  })
  public async updateComment(
    @UserId() userId: Types.ObjectId,
    @Param() { commentId }: IPostsCommentsFindParams,
    @Body() updateCommentDto: UpdatePostCommentDto,
  ): Promise<ICPosts> {
    return await this.postsService.updateComment(userId, commentId, updateCommentDto);
  }

  /**
   * Удаление комментария поста.
   * @param userId - id пользователя.
   * @param deleteCommentDto - Данные для удаления комментария.
   * @returns - Обновленный комментарий.
   */
  @Delete('comments/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async deleteComment(
    @UserId() userId: Types.ObjectId,
    @Body() deleteCommentDto: DeletePostCommentDto,
  ): Promise<IRemoveEntity<string>> {
    return await this.postsService.deleteComment(userId, deleteCommentDto);
  }
}
