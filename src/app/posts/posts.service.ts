import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDto } from './dto/post.dto';
import { PostModel } from './models/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
  ) {}

  async getPostsList(): Promise<PostModel[]> {
    const posts = await this.postModel.find({});

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

  async update(postDto: PostDto): Promise<PostDto> {
    const {
      _id,
      authorId,
      pText,
      createdAt,
      updatedAt,
      stick,
      pImg,
      likes,
      views,
      group,
    } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new HttpException('Post not found !', HttpStatus.BAD_REQUEST);
    } else if (authorId === postInDb.authorId) {
      await postInDb.updateOne({
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
      });
      await postInDb.save();

      return postInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(postDto: PostDto): Promise<PostDto> {
    const { _id, authorId } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new HttpException('Post not found !', HttpStatus.BAD_REQUEST);
    } else if (authorId === postInDb.authorId) {
      await postInDb.deleteOne({
        _id,
      });

      if (postInDb) {
        throw new HttpException('OK Deleted', HttpStatus.OK);
      }

      return postInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }
}
