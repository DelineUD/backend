import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { postListMapper, postMapper } from './posts.mapper';
import { PostCommentsModel } from './models/posts.comments.model';
import { PostModel } from './models/posts.model';
import { IPosts } from './interfaces/posts.interface';
import { PostUploadDto } from '@app/posts/dto/post-upload.dto';
import { CreatePostDto } from '@app/posts/dto/create.post.dto';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';
import { IPostsFindComments } from '@app/posts/interfaces/posts-find-comments.interface';
import { CreatePostCommentDto } from '@app/posts/dto/create-post-comment.dto';
import { ICPosts } from '@app/posts/interfaces/posts.comments.interface';
import { PostCommentLikeDto } from '@app/posts/dto/post-comment-like.dto';
import { UpdatePostCommentDto } from '@app/posts/dto/update-post-comment.dto';
import { DeletePostCommentDto } from '@app/posts/dto/delete-post-comment.dto';
import { IPostsFindParams } from '@app/posts/interfaces/posts-find.interface';
import { IPostsFindQuery } from '@app/posts/interfaces/post-find-query';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name) private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, postDto: CreatePostDto): Promise<IPosts> {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      return await this.postModel.create({
        ...postDto,
        author: userId,
        countComments: 0,
        countLikes: 0,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(userId: string, postDto: UpdatePostDto): Promise<IPosts> {
    try {
      const { postId, ...updateDto } = postDto;
      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      if (userId !== postInDb.author) {
        throw new BadRequestException('Нет доступа!');
      }

      await postInDb.updateOne({ ...updateDto }).exec();
      return await postInDb.save();
    } catch (err) {
      throw err;
    }
  }

  async delete(userId: string, postDto: DeletePostDto): Promise<IRemoveEntity<IPosts>> {
    try {
      const { postId } = postDto;

      const deletedPost = await this.postModel.findOneAndDelete({ _id: postId }).exec();
      if (!deletedPost) {
        throw new EntityNotFoundError('Запись не найдена!');
      }

      if (userId !== deletedPost.author) {
        throw new BadRequestException('Нет доступа!');
      }

      await this.postCommentsModel.deleteMany({ author: deletedPost._id });

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: deletedPost,
      };
    } catch (err) {
      throw err;
    }
  }

  async findAll(userId: string, queryParams: IPostsFindQuery): Promise<IPosts[]> {
    try {
      const { search, lastIndex, group } = queryParams;

      const user = await this.usersService.findOne({ _id: userId });

      const query: {
        pText?: {
          $regex: RegExp;
        };
        group?: string;
        _id?: {
          $lt: string;
        };
      } = {};
      search && (query.pText = { $regex: new RegExp(search, 'i') });
      group && (query.group = group);
      lastIndex && (query._id = { $lt: lastIndex });

      const posts = await this.postModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .skip(!lastIndex ? 0 : 10);

      return postListMapper(posts, user);
    } catch (err) {
      throw err;
    }
  }

  async findPostById(userId: string, params: IPostsFindParams): Promise<IPosts> {
    try {
      const { postId } = params;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const post = await this.postModel
        .findOne({ _id: postId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!post) {
        throw new EntityNotFoundError('Запись не найдена');
      }

      return postMapper(post, user);
    } catch (err) {
      throw err;
    }
  }

  async uploadImages(uploadFilesDto: PostUploadDto, files: Express.Multer.File[]): Promise<IPosts> {
    try {
      const { postId, authorId } = uploadFilesDto;

      const postInDb = await this.postModel.findOne({ _id: postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      if (authorId !== postInDb.author) {
        throw new BadRequestException('Нет доступа!');
      }

      if (files?.length && !postInDb.pImg.length) {
        await postInDb.updateOne({
          pImg: files,
        });
        await postInDb.save();
        return await this.postModel.findOne({ _id: postId }).exec();
      }

      if (files?.length && postInDb.pImg?.length) {
        await postInDb.updateOne({
          pImg: [...postInDb.pImg, ...files],
        });

        await postInDb.save();
        return await this.postModel.findOne({ _id: postId }).exec();
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async like(userId: string, params: IPostsFindParams): Promise<IPosts> {
    try {
      const { postId } = params;

      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const arrLikes: string[] = postInDb.likes;

      if (!arrLikes.includes(userId)) {
        arrLikes.unshift(userId);
        await postInDb.updateOne({
          likes: arrLikes,
          countLikes: postInDb.countLikes++,
        });
      } else {
        const filteredArray = arrLikes.filter((item) => item !== userId);
        await postInDb.updateOne({
          likes: filteredArray,
          countLikes: filteredArray.length,
        });
      }

      await postInDb.save();
      return await this.postModel.findOne({ _id: postId }).exec();
    } catch (err) {
      throw err;
    }
  }

  async createComment(userId: string, createCommentDto: CreatePostCommentDto): Promise<ICPosts> {
    try {
      const postInDb = await this.postModel.findOne({ _id: createCommentDto.postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const initialCommentValues = {
        likes: [],
        countLikes: 0,
        isLiked: false,
      };
      const comment: PostCommentsModel = new this.postCommentsModel({
        ...createCommentDto,
        ...initialCommentValues,
        author: userId,
      });

      await Promise.all([
        await comment.save(),
        await postInDb.updateOne({ countComments: postInDb.countComments + 1 }),
      ]);

      return comment;
    } catch (err) {
      throw err;
    }
  }

  async commentList(params: IPostsFindComments): Promise<ICPosts[]> {
    try {
      const { postId } = params;
      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Комментарии не найдены`);
      }

      const comments = await this.postCommentsModel
        .find({ postId })
        .populate('author', '_id first_name last_name avatar')
        .exec();

      if (!comments) {
        return [];
      }

      return comments as ICPosts[];
    } catch (err) {
      throw err;
    }
  }

  async commentLike(userId: string, commentLikeDto: PostCommentLikeDto): Promise<ICPosts> {
    try {
      const { postId, commentId } = commentLikeDto;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const post = await this.postModel.findOne({ _id: postId }).exec();
      if (!post) {
        throw new EntityNotFoundError('Запись не найдена');
      }

      const comment = await this.postCommentsModel.findOne({ _id: commentId }).exec();
      if (!comment) {
        throw new EntityNotFoundError(`Комментарий не найден`);
      }

      const arrLikes = comment.likes;
      let checkResult = false;

      if (arrLikes.length === 0) {
        await comment.updateOne({
          likes: [user._id, ...arrLikes],
          countLikes: 1,
        });
        await comment.save();
      } else {
        checkResult = arrLikes.includes(user._id.toString());

        if (!checkResult) {
          await comment.updateOne({
            likes: [user._id, ...arrLikes],
            countLikes: comment.countLikes + 1,
          });
          await comment.save();
        } else {
          const filteredArray = arrLikes.filter((f) => f !== user._id.toString());
          const count = filteredArray.length;
          await comment.updateOne({
            likes: filteredArray,
            countLikes: count,
          });
          await comment.save();
        }
      }

      return await this.postCommentsModel.findOne({ postId, _id: commentId }).exec();
    } catch (err) {
      throw err;
    }
  }

  async updateComment(userId: string, commentId: string, updateCommentDto: UpdatePostCommentDto): Promise<ICPosts> {
    try {
      const { postId } = updateCommentDto;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const comment = await this.postCommentsModel
        .findOneAndUpdate({ author: userId, postId: postId, _id: commentId }, { ...updateCommentDto }, { new: true })
        .exec();

      if (!comment) {
        throw new EntityNotFoundError(`Комментарий не найден`);
      }

      return comment;
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(userId: string, deleteCommentDto: DeletePostCommentDto): Promise<IRemoveEntity<ICPosts>> {
    try {
      const { commentId, postId } = deleteCommentDto;

      const comment = await this.postCommentsModel.findOneAndDelete({ _id: commentId, author: userId, postId }).exec();

      if (!comment) {
        throw new EntityNotFoundError(`Комментарий не найден!`);
      }

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: comment,
      };
    } catch (err) {
      throw err;
    }
  }

  async addView(userId: string, params: IPostsFindParams): Promise<number> {
    try {
      const { postId } = params;
      const user = await this.usersService.findOne({ _id: userId });
      const post = await this.postModel.findOne({ author: userId, _id: postId }).exec();

      if (!post) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      const arrViews: string[] = post.views;

      const checkResult: boolean = arrViews.includes(user._id.toString());

      if (!checkResult) {
        await post.updateOne({
          views: [user._id, ...arrViews],
        });
        await post.save();
      }

      const newPost = await this.postModel.findOne({ _id: postId }).exec();
      const res = postMapper(newPost, user);

      return res.views_count;
    } catch (err) {
      throw err;
    }
  }
}
