import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { postListMapper, postMapper } from './mappers/posts.mapper';
import { PostCommentsModel } from './models/posts-comments.model';
import { PostModel } from './models/posts.model';
import { IPosts } from './interfaces/posts.interface';
import { PostUploadDto } from '@app/posts/dto/post-upload.dto';
import { CreatePostDto } from '@app/posts/dto/create.post.dto';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';
import { CreatePostCommentDto } from '@app/posts/dto/create-post-comment.dto';
import { ICPosts, ICPostsResponse } from '@app/posts/interfaces/posts.comments.interface';
import { PostCommentLikeDto } from '@app/posts/dto/post-comment-like.dto';
import { UpdatePostCommentDto } from '@app/posts/dto/update-post-comment.dto';
import { DeletePostCommentDto } from '@app/posts/dto/delete-post-comment.dto';
import { IPostsFindParams } from '@app/posts/interfaces/posts-find.interface';
import { IPostsFindQuery } from '@app/posts/interfaces/post-find-query';
import { ILike } from '@app/posts/interfaces/like.interface';
import { GroupFilterKeys } from '@app/filters/consts';
import { commentListMapper } from '@app/posts/mappers/comments.mapper';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name) private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: Types.ObjectId, postDto: CreatePostDto): Promise<IPosts> {
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

  async update(userId: Types.ObjectId, postDto: UpdatePostDto): Promise<IPosts> {
    try {
      const { postId, ...updateDto } = postDto;
      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      if (userId !== postInDb.author._id) {
        throw new BadRequestException('Нет доступа!');
      }

      await postInDb.updateOne({ ...updateDto }).exec();
      return await postInDb.save();
    } catch (err) {
      throw err;
    }
  }

  async delete(userId: Types.ObjectId, postDto: DeletePostDto): Promise<IRemoveEntity<string>> {
    try {
      const { postId } = postDto;

      const deletedPost = await this.postModel
        .findOneAndDelete({ _id: postId, author: userId })
        .populate('author', '_id')
        .exec();

      if (!deletedPost) {
        throw new EntityNotFoundError('Запись не найдена!');
      }

      await this.postCommentsModel.deleteMany({ postId: deletedPost._id });

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: deletedPost._id,
      };
    } catch (err) {
      throw err;
    }
  }

  async findAll(userId: Types.ObjectId, queryParams: IPostsFindQuery): Promise<IPosts[]> {
    try {
      const query: IPostsFindQuery = { ...queryParams };

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const finalQuery: FilterQuery<Partial<IPosts>> = {};

      query.search && (finalQuery.pText = { $regex: new RegExp(query.search, 'i') });
      query.group && (finalQuery.group = GroupFilterKeys[query.group]);
      query.lastIndex && (finalQuery._id = { $lt: query.lastIndex });

      const posts = await this.postModel
        .find(finalQuery)
        .populate('author', '_id avatar first_name last_name')
        .sort(typeof query.desc !== 'undefined' && { createdAt: -1 })
        .limit(10)
        .skip(!finalQuery.lastIndex ? 0 : 10)
        .exec();

      return postListMapper(posts, user);
    } catch (err) {
      throw err;
    }
  }

  async findPostById(userId: Types.ObjectId, params: IPostsFindParams): Promise<IPosts> {
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

  async uploadImages(
    userId: Types.ObjectId,
    uploadFilesDto: PostUploadDto,
    files: Express.Multer.File[],
  ): Promise<IPosts> {
    try {
      const { postId } = uploadFilesDto;

      const post = await this.postModel.findOne({ _id: postId, author: userId }).exec();
      if (!post) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      const filesToNames = files.map((file) => `${process.env.SERVER_URL}/${process.env.STATIC_PATH}/${file.filename}`);
      console.log(files);

      if (files?.length && !post.pImg.length) {
        await post.updateOne({
          pImg: filesToNames,
        });
        await post.save();
        return await this.postModel.findOne({ _id: postId }).exec();
      }

      if (files?.length && post.pImg?.length) {
        await post.updateOne({
          pImg: [...post.pImg, ...filesToNames],
        });

        await post.save();
        return await this.postModel.findOne({ _id: postId }).exec();
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async like(userId: Types.ObjectId, params: IPostsFindParams): Promise<ILike> {
    try {
      const { postId } = params;

      const postInDb = await this.postModel.findOne({ _id: postId, author: userId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const likes = postInDb.isLiked
        ? postInDb.likes.filter((i) => i !== String(userId))
        : postInDb.likes.unshift(String(userId));
      const countLikes = postInDb.isLiked ? 0 : 1;
      const isLiked = !postInDb.isLiked;

      await postInDb.updateOne({ likes, countLikes, isLiked });
      await postInDb.save();

      return {
        _id: postInDb._id,
        countLikes,
        isLiked,
      };
    } catch (err) {
      throw err;
    }
  }

  async createComment(userId: Types.ObjectId, createCommentDto: CreatePostCommentDto): Promise<ICPosts> {
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

  async commentList(userId: Types.ObjectId, params: IPostsFindParams): Promise<ICPostsResponse[]> {
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

      return commentListMapper(comments, userId);
    } catch (err) {
      throw err;
    }
  }

  async commentLike(userId: Types.ObjectId, params: PostCommentLikeDto): Promise<ILike> {
    try {
      const { postId, commentId } = params;

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

      const likes = comment.isLiked
        ? comment.likes.filter((i) => i !== String(userId))
        : comment.likes.unshift(String(userId));
      const countLikes = comment.isLiked ? 0 : 1;
      const isLiked = !comment.isLiked;

      await comment.updateOne({ likes, countLikes, isLiked });
      await comment.save();

      return {
        _id: comment._id,
        countLikes,
        isLiked,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateComment(
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
    updateCommentDto: UpdatePostCommentDto,
  ): Promise<ICPosts> {
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

  async deleteComment(userId: Types.ObjectId, deleteCommentDto: DeletePostCommentDto): Promise<IRemoveEntity<string>> {
    try {
      const { commentId, postId } = deleteCommentDto;

      const comment = await this.postCommentsModel.findOneAndDelete({ _id: commentId, author: userId, postId }).exec();

      if (!comment) {
        throw new EntityNotFoundError(`Комментарий не найден!`);
      }

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: comment._id,
      };
    } catch (err) {
      throw err;
    }
  }

  async addView(userId: Types.ObjectId, params: IPostsFindParams): Promise<number> {
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
