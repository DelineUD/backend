import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { FilterQuery, Model, Types } from 'mongoose';

import { GroupFilterKeys } from '@app/filters/consts';
import { CreatePostCommentDto } from '@app/posts/dto/create-post-comment.dto';
import { CreatePostDto } from '@app/posts/dto/create.post.dto';
import { DeletePostCommentDto } from '@app/posts/dto/delete-post-comment.dto';
import { PostCommentLikeDto } from '@app/posts/dto/post-comment-like.dto';
import { PostsHideDto } from '@app/posts/dto/posts-hide.dto';
import { UpdatePostCommentDto } from '@app/posts/dto/update-post-comment.dto';
import { ILike } from '@app/posts/interfaces/like.interface';
import { IPostsFindQuery } from '@app/posts/interfaces/post-find-query';
import { IPostsCommentsFindQuery } from '@app/posts/interfaces/posts-comments-find.interface';
import { IPostsFindParams } from '@app/posts/interfaces/posts-find.interface';
import { ICPosts, ICPostsResponse } from '@app/posts/interfaces/posts.comments.interface';
import { commentListMapper } from '@app/posts/mappers/comments.mapper';
import { UserModel } from '@app/users/models/user.model';
import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';
import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPosts, IPostsResponse } from './interfaces/posts.interface';
import { postListMapper, postMapper } from './mappers/posts.mapper';
import { PostCommentsModel } from './models/posts-comments.model';
import { PostModel } from './models/posts.model';
import { getUploadedFilesWithType } from '@helpers/getUploadedFilesWithType';
import { IPostFile } from '@app/posts/interfaces/post-file.interface';

const logger = new Logger('Posts');

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name) private readonly postCommentsModel: Model<PostCommentsModel>,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
  ) {}

  async create(
    userId: Types.ObjectId,
    postDto: CreatePostDto,
    uploadedFiles: Express.Multer.File[],
  ): Promise<IPostsResponse> {
    try {
      const { files, ...createPostDto } = { ...postDto };

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) throw new EntityNotFoundError('Пользователь не найден');

      const initialPostValues: Partial<IPosts> = {
        likes: [],
        views: [],
        countComments: 0,
      };

      const uploadedPostFiles: IPostFile[] = getUploadedFilesWithType<IPostFile>(uploadedFiles);

      const post = await this.postModel.create({
        ...createPostDto,
        ...initialPostValues,
        files: files ? files.concat(uploadedPostFiles) : uploadedPostFiles,
        authorId: user._id,
      });

      logger.log(`Post successfully created!`);

      return this.findPostById(userId, { postId: post._id });
    } catch (err) {
      logger.error(`Error while create: ${(err as Error).message}`);
      throw err;
    }
  }

  async update(
    userId: Types.ObjectId,
    postDto: UpdatePostDto,
    uploadedFiles: Express.Multer.File[],
  ): Promise<IPostsResponse> {
    try {
      const { postId, files, ...updateDto } = postDto;
      const postInDb = await this.postModel.findOne({ _id: postId }).exec();

      if (!postInDb) throw new EntityNotFoundError(`Запись не найдена!`);
      if (String(userId) !== String(postInDb.authorId)) throw new BadRequestException('Нет доступа!');

      const uploadedPostFiles: IPostFile[] = getUploadedFilesWithType<IPostFile>(uploadedFiles);

      await postInDb
        .updateOne({
          ...updateDto,
          files: files ? files.concat(uploadedPostFiles) : uploadedPostFiles,
        })
        .exec();
      await postInDb.save();

      logger.log('Post successfully updated!');

      return await this.findPostById(userId, { postId: postInDb._id });
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

  async deleteAll(userId: Types.ObjectId, where: Partial<IPosts>): Promise<DeleteResult> {
    try {
      const deletedPosts = await this.postModel.deleteMany({ ...where, authorId: userId });
      if (!deletedPosts) {
        throw new EntityNotFoundError('Ошибка при удалении записей');
      }

      logger.log('Posts successfully deleted!');

      const deletedComments = await this.postCommentsModel.deleteMany({ author: userId });
      if (!deletedComments) {
        throw new EntityNotFoundError('Ошибка при удалении комментариев');
      }

      logger.log('Comments successfully deleted!');

      return deletedPosts;
    } catch (err) {
      logger.error(`Error while deleteAll: ${(err as Error).message}`);
      throw err;
    }
  }

  async findAll(userId: Types.ObjectId, queryParams: IPostsFindQuery): Promise<IPostsResponse[]> {
    try {
      const query: IPostsFindQuery = { ...queryParams };
      const baseQuery: FilterQuery<Partial<IPosts>> = {};

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      if (query.userId) {
        const queryUser = await this.usersService.findOne({ _id: query.userId as unknown as Types.ObjectId });
        queryUser && (baseQuery.authorId = queryUser._id);
      } else {
        baseQuery.authorId = { $nin: user.hidden_authors };
      }

      query.search && (baseQuery.pText = { $regex: new RegExp(query.search, 'i') });
      query.groups && (baseQuery.groups = { $in: query.groups.map((i) => GroupFilterKeys[i]) });
      query.publishInProfile && (baseQuery.publishInProfile = query.publishInProfile);
      baseQuery._id = {
        $nin: user.hidden_posts,
        ...(query.lastIndex && { $lt: query.lastIndex }),
      };

      const posts = await this.postModel
        .find(baseQuery)
        .populate('author', '_id avatar first_name last_name blocked_users')
        .sort(typeof query.desc === 'undefined' && { createdAt: -1 })
        .limit(10)
        .skip(!baseQuery.lastIndex ? 0 : 10)
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
        .populate('author', '_id first_name last_name avatar blocked_users')
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

  async hide(userId: Types.ObjectId, { authorId, postId }: PostsHideDto): Promise<void> {
    try {
      const userInDb = await this.usersService.findOne({ _id: userId });
      if (!userInDb) {
        throw new EntityNotFoundError(`Пользователь не найден`);
      }

      await Promise.allSettled([await this.hideAuthor(authorId, userInDb), await this.hidePost(postId, userInDb)]);

      return;
    } catch (err) {
      logger.error(`Error while hide: ${(err as Error).message}`);
      throw err;
    }
  }

  private async hideAuthor(authorId: string | undefined, userInDb: UserModel): Promise<Types.ObjectId[]> {
    try {
      if (!authorId) return;

      const authorInDb = await this.usersService.findOne({ _id: new Types.ObjectId(authorId) });
      if (!authorInDb) {
        throw new EntityNotFoundError(`Автор не найден`);
      }

      if (authorInDb._id === userInDb._id) {
        throw new BadRequestException('User id is equal author id!');
      }

      await this.usersService.updateByPayload(
        { _id: userInDb._id },
        { hidden_authors: this.getToggledHidden(userInDb.hidden_authors, authorInDb._id) },
      );
    } catch (err) {
      logger.error(`Error while hideAuthor: ${(err as Error).message}`);
      throw err;
    }
  }

  private async hidePost(postId: string | undefined, userInDb: UserModel) {
    try {
      if (!postId) return;

      const postInDb = await this.postModel.findOne({ _id: new Types.ObjectId(postId) });
      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена`);
      }

      if (userInDb._id === postInDb.authorId) {
        throw new BadRequestException('User id is equal post author id!');
      }

      await this.usersService.updateByPayload(
        { _id: userInDb._id },
        { hidden_posts: this.getToggledHidden(userInDb.hidden_posts, postInDb._id) },
      );
    } catch (err) {
      logger.error(`Error while hidePost: ${(err as Error).message}`);
      throw err;
    }
  }

  private getToggledHidden = (arr: Types.ObjectId[], el: Types.ObjectId): Types.ObjectId[] => {
    const hiddenArray = [...arr];
    const hiddenIndex = hiddenArray.findIndex((i) => i.equals(el));

    hiddenIndex === -1 ? hiddenArray.push(el) : hiddenArray.splice(hiddenIndex, 1);

    return hiddenArray;
  };
}
