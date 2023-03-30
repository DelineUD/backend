import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IPosts } from './interfaces/posts.interface';
import { postListMapper } from './mapper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDto } from './dto/post.dto';
import { PostModel } from './models/posts.model';
import { CreateStatus } from './interfaces/create-status.interface';


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
    const { _id,  authorId, cDate, pText, stick, pImg, likes, views, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (postInDb) {throw new HttpException('This post already created ', HttpStatus.BAD_REQUEST);}

else {
    const post: PostModel = await new this.postModel({
      authorId,
      cDate,
      pText,
      stick,
      pImg,
      likes,
      views,
      group
    });

    await post.save();

    if(post){throw new HttpException('OK Created', HttpStatus.OK);}
    
    return post;
     
  }
  
  }
  
  async update(postDto: PostDto): Promise<PostDto> {
    const { _id,  authorId, cDate, pText, stick, pImg, likes, views, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {throw new HttpException('Post not found !', HttpStatus.BAD_REQUEST);}

    else if (authorId === postInDb.authorId) {

      await postInDb.updateOne({
        _id,
        authorId,
        cDate,
        pText,
        stick,
        pImg,
        likes,
        views,
        group

      });
      await postInDb.save();

      if(postInDb){throw new HttpException('OK Updated', HttpStatus.OK);}

      return postInDb;
    }
      else {throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);}
    }

    
    async delete(postDto: PostDto): Promise<PostDto> {
      const { _id,  authorId } = postDto;
  
      const postInDb = await this.postModel.findOne({ _id }).exec();
      if (!postInDb) {throw new HttpException('Post not found !', HttpStatus.BAD_REQUEST);}
  
      else if (authorId === postInDb.authorId) {
  
        await postInDb.deleteOne({
          _id
        });
  
        if(postInDb){throw new HttpException('OK Deleted', HttpStatus.OK);}
  
        return postInDb;
      }
        else {throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);}
      }

  }