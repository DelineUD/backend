import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { postListMapper, postMapper } from './mappers/posts.mapper';
import { PostCommentsModel } from './models/posts-comments.model';
import { PostModel } from './models/posts.model';
import { IPosts, IPostsResponse } from './interfaces/posts.interface';
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
import { IPostsCommentsFindQuery } from '@app/posts/interfaces/posts-comments-find.interface';

const logger = new Logger('Posts');

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name) private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: Types.ObjectId, postDto: CreatePostDto): Promise<IPosts> {
    try {
      const createPostDto = { ...postDto };

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const initialPostValues: Partial<IPosts> = {
        likes: [],
        views: [],
        countComments: 0,
      };

      return await this.postModel.create({
        ...createPostDto,
        ...initialPostValues,
        author: userId,
      });
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
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
      await postInDb.save();

      logger.log('Post successfully updated!');

      return postInDb;
    } catch (err) {
      logger.error(`Error while update: ${(err as Error).message}`);
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
        throw new EntityNotFoundError('Запись не найдена');
      }

      await this.postCommentsModel.deleteMany({ postId: deletedPost._id });

      logger.log('Post successfully deleted!');

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: deletedPost._id,
      };
    } catch (err) {
      logger.error(`Error while delete: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(userId: Types.ObjectId, queryParams: IPostsFindQuery): Promise<IPostsResponse[]> {
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
        .sort(typeof query.desc === 'undefined' && { createdAt: -1 })
        .limit(10)
        .skip(!finalQuery.lastIndex ? 0 : 10)
        .exec();

      return postListMapper(posts, user);
    } catch (err) {
      logger.error(`Error while findAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findPostById(userId: Types.ObjectId, params: IPostsFindParams): Promise<IPostsResponse> {
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
      logger.error(`Error while findPostById: ${(err as Error).message}`);
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

        logger.log('Images successfully uploaded!');

        return await this.postModel.findOne({ _id: postId }).exec();
      }

      return;
    } catch (err) {
      logger.error(`Error while uploadImages: ${(err as Error).message}`);
      throw err;
    }
  }

  async like(userId: Types.ObjectId, params: IPostsFindParams): Promise<ILike> {
    try {
      const { postId } = params;

      const postInDb = await this.postModel.findOne({ _id: postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const likes: string[] = postInDb.likes.includes(String(userId))
        ? postInDb.likes.filter((i) => i !== String(userId))
        : (postInDb.likes = [String(userId), ...postInDb.likes]);

      const countLikes: number = likes.length;
      const isLiked: boolean = likes.includes(String(userId));

      await postInDb.updateOne({ likes }).exec();
      await postInDb.save();

      logger.log('Post successfully liked!');

      return {
        _id: postInDb._id,
        countLikes,
        isLiked,
      };
    } catch (err) {
      logger.error(`Error while like: ${(err as Error).message}`);
      throw err;
    }
  }

  async createComment(userId: Types.ObjectId, createCommentDto: CreatePostCommentDto): Promise<ICPosts> {
    try {
      const dto = createCommentDto;

      const postInDb = await this.postModel.findOne({ _id: dto.postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const initialCommentValues = {
        likes: [],
        countLikes: 0,
        isLiked: false,
      };
      const comment = await this.postCommentsModel.create({
        ...dto,
        ...initialCommentValues,
        author: userId,
      });

      await postInDb.updateOne({ countComments: postInDb.countComments + 1 }).exec();
      await postInDb.save();

      logger.log('Comment successfully created!');

      return comment;
    } catch (err) {
      logger.error(`Error while createComment: ${(err as Error).message}`);
      throw err;
    }
  }

  async commentList(
    userId: Types.ObjectId,
    params: IPostsFindParams,
    query: IPostsCommentsFindQuery,
  ): Promise<ICPostsResponse[]> {
    try {
      const { postId } = params;
      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const comments = await this.postCommentsModel
        .find({ postId })
        .populate('author', '_id first_name last_name avatar')
        .sort(typeof query.desc === 'undefined' && { createdAt: -1 })
        .exec();

      if (!comments) {
        return [];
      }

      return commentListMapper(comments, userId);
    } catch (err) {
      logger.error(`Error while commentList: ${(err as Error).message}`);
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
        : (comment.likes = [String(userId), ...comment.likes]);
      const countLikes = likes.length;
      const isLiked = !comment.isLiked;

      await comment.updateOne({ likes, countLikes, isLiked });
      await comment.save();

      logger.log('Comment successfully liked!');

      return {
        _id: comment._id,
        countLikes,
        isLiked,
      };
    } catch (err) {
      logger.error(`Error while commentLike: ${(err as Error).message}`);
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

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const comment = await this.postCommentsModel
        .findOneAndUpdate(
          { author: String(userInDb._id), postId: postId, _id: commentId },
          { ...updateCommentDto },
          { new: true },
        )
        .exec();

      if (!comment) {
        throw new EntityNotFoundError(`Комментарий не найден`);
      }

      logger.log('Comment successfully updated!');

      return comment;
    } catch (err) {
      logger.error(`Error while updateComment: ${(err as Error).message}`);
      throw err;
    }
  }

  async deleteComment(userId: Types.ObjectId, deleteCommentDto: DeletePostCommentDto): Promise<IRemoveEntity<string>> {
    try {
      const { commentId, postId } = deleteCommentDto;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const postInDb = await this.postModel.findOne({ _id: postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const deletedComment = await this.postCommentsModel
        .findOneAndDelete({ _id: commentId, author: String(userInDb._id), postId: String(postInDb._id) })
        .exec();

      if (!deletedComment) {
        throw new EntityNotFoundError(`Комментарий не найден`);
      }

      logger.log('Comment successfully deleted!');

      await postInDb.updateOne({ countComments: postInDb.countComments - 1 }).exec();
      await postInDb.save();

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: deletedComment._id,
      };
    } catch (err) {
      logger.error(`Error while deleteComment: ${(err as Error).message}`);
      throw err;
    }
  }

  async addView(userId: Types.ObjectId, params: IPostsFindParams): Promise<number> {
    try {
      const { postId } = params;

      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      const postInDb = await this.postModel.findOne({ _id: postId }).exec();
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      const isViewed: boolean = postInDb.views.includes(String(userInDb._id));
      const arrViews: string[] = isViewed ? postInDb.views : [String(userInDb._id), ...postInDb.views];

      if (!isViewed) {
        await postInDb.updateOne({ views: arrViews });
        await postInDb.save();
      }

      logger.log('Post successfully viewed!');

      return arrViews.length;
    } catch (err) {
      logger.error(`Error while addView: ${(err as Error).message}`);
      throw err;
    }
  }
}
