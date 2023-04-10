import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { DeletePostDto } from './dto/delete.post.dto';
import { GetPostParamsDto } from './dto/get-post-params.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { PostModel } from './models/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
  ) {}

  async getPostsList(): Promise<PostModel[]> {
    const posts = await this.postModel.find({}).sort({ createdAt: -1 });

    return posts;
  }

  async create(postDto: PostDto): Promise<PostDto> {
    const {
      _id,
      createdAt,
      updatedAt,
      authorId,
      pText,
      stick,
      pImg,
      likes,
      views,
      group,
    } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (postInDb) {
      throw new HttpException(
        'This post already created ',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const post: PostModel = await new this.postModel({
        authorId,
        createdAt,
        updatedAt,
        pText,
        stick,
        pImg,
        likes,
        views,
        group,
      });

      await post.save();

      return post;
    }
  }

  async update(postDto: UpdatePostDto): Promise<UpdatePostDto> {
    const { _id, authorId, pText, stick, pImg, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    } else if (authorId === postInDb.authorId) {
      await postInDb.updateOne({
        _id,
        authorId,
        pText,
        stick,
        pImg,
        group,
      });
      await postInDb.save();

      return postInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(postDto: DeletePostDto): Promise<DeletePostDto> {
    const { _id, authorId } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new EntityNotFoundError('не найден пост для удаления');
    } else if (authorId === postInDb.authorId) {
      await postInDb.deleteOne({
        _id,
      });

      if (postInDb) {
        throw new HttpException('OK Deleted', HttpStatus.NO_CONTENT);
      }

      return postInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }

  async getPostById(
    getPostParamsDto: GetPostParamsDto,
  ): Promise<GetPostParamsDto> {
    const _id = getPostParamsDto._id;

    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError('пост не найден');
    }
    return postInDb;
  }
}
