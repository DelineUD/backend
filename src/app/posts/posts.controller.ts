import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
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
import { CreatePostEntity } from './entities/create-post.entity';
import { DeletePostEntity } from './entities/delete-posts.entity';
import { PostEntity } from './entities/posts.entity';
import { UpdatePostEntity } from './entities/update-posts.entity';
import { IPosts } from './interfaces/posts.interface';
import { PostsService } from './posts.service';
var postId: any = 0;

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
  async getById(@Param() params: GetPostParamsDto): Promise<GetPostParamsDto> {
    const result = await this.PostsService.getPostById(params);
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
}
