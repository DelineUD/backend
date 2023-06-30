import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  public async gettList(@Request() data: any): Promise<any> {
    const result = await this.PostsService.getPostsList(data);
    return result;
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
    @Body() createPostDto: CreatePostDto,
  ): Promise<CreatePostDto> {
    const result = await this.PostsService.create(createPostDto);

    return result;
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
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    const result: UpdatePostDto = await this.PostsService.update(updatePostDto);

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
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
    @Body() deletePostDto: DeletePostDto,
  ): Promise<DeletePostDto> {
    const result: DeletePostDto = await this.PostsService.delete(deletePostDto);

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Get(':_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'пост по id',
    type: PostEntity,
  })
  async getById(
    @Param() params: GetPostParamsDto,
    @Request() data: any,
  ): Promise<GetPostParamsDto> {
    const result = await this.PostsService.getPostById(params, data);
    return result;
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
        destination: '/var/www/html/teststand',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async upImages(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files,
  ): Promise<CreatePostDto> {
    let result: any;
    const response = files.filter(Boolean).map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      url: `https://teststand.udmobile.app:81/${file.filename}`,
    }));

    console.log(response);
    result = await this.PostsService.upImages(createPostDto, response);

    return result;
  }
  @Post(':_id/view')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Просмотры',
    type: PostEntity,
  })
  async addView(@Param() params: any, @Request() data: any): Promise<any> {
    const result = await this.PostsService.addView(params, data.user._id);
    return result;
  }

  @Post(':_id/like')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Лайки',
    type: PostEntity,
  })
  async liked(
    @Param() params: GetPostParamsDto,
    @Request() data: any,
  ): Promise<GetPostParamsDto> {
    const result = await this.PostsService.liked(params, data.user._id);
    return result;
  }

  @Post(':_id/comments')
  @ApiBody({
    description: 'Новывй коммент',
    type: CreatePostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Коммент успешно создан',
    type: CreatePostEntity,
  })
  public async createComment(
    @Body() createComments: IcPosts,
    @Param() params: GetPostParamsDto,
    @Request() data: any,
  ): Promise<IcPosts> {
    const result = await this.PostsService.createComment(
      createComments,
      params,
      data.user._id,
    );
    return result;
  }

  @Get(':_id/comments')
  @ApiBody({
    description: 'Список комментов',
    type: CommentListEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список комментов',
    type: CommentListEntity,
  })
  public async CommentList(
    @Param() params: GetPostParamsDto,
    @Request() data: any,
  ): Promise<IcPosts[]> {
    const result = await this.PostsService.CommentList(params, data.user._id);
    return result;
  }

  @Post(':_id_post/like-comment/:_id_comment/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Лайки',
    type: CommentListEntity,
  })
  async Commentliked(
    @Param('_id_post') post_id: any,
    @Param('_id_comment') comment_ID: any,
    @Request() data: any,
  ): Promise<GetPostParamsDto> {
    console.log(post_id);
    console.log(comment_ID);
    const result = await this.PostsService.Commentliked(
      post_id,
      comment_ID,
      data.user._id,
    );

    return result;
  }

  @Post(':_id_post/update-comment/:_id_comment')
  @ApiBody({
    description: 'Обновление коммента',
    type: UpdateCommentPostEntity,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'коммент успешно обновлен',
    type: UpdateCommentPostEntity,
  })
  public async updateComment(
    @Param('_id_post') post_id: any,
    @Param('_id_comment') comment_ID: any,
    @Body() updateComment: IcPosts,
    @Request() data: any,
  ): Promise<IcPosts> {
    const result: IcPosts = await this.PostsService.updateComment(
      comment_ID,
      updateComment,
      data.user._id,
    );

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
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
    @Param('_id_comment') comment_ID: any,
    @Request() data: any,
  ): Promise<any> {
    console.log(post_id);
    console.log(comment_ID);
    const result: IcPosts = await this.PostsService.deleteComment(
      comment_ID,
      data.user._id,
      post_id,
    );

    if (!result) {
      throw new HttpException('Some error', HttpStatus.BAD_REQUEST);
    }

    return result;
  }
}
