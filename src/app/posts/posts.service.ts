import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityNotFoundError } from '@shared/interceptors/not-found.interceptor';

import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { GetPostParamsDto } from './dto/get-post-params.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IcPosts } from './interfaces/posts.comments.interface';
import { commentItemMapper, postListMapper, postMapper } from './mapper';
import { PostCommentsModel } from './models/posts.comments.model';
import { PostModel } from './models/posts.model';
import { IPosts } from './interfaces/posts.interface';
import { PostUploadDto } from '@app/posts/dto/post-upload.dto';
import { IPostsFindQuery } from '@app/posts/interfaces/posts-find-query.interface';
import { CreatePostDto } from '@app/posts/dto/create.post.dto';
import { IRemoveEntity } from '@shared/interfaces/remove-entity.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name) private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: string, queryParams: IPostsFindQuery): Promise<IPosts[]> {
    try {
      const { search, lastIndex, group } = queryParams;

      const user = await this.usersService.findOne({ _id: userId });

      const query: { pText?: { $regex: RegExp }; group?: string; _id?: { $lt: string } } = {};
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

  async create(postDto: CreatePostDto): Promise<IPosts> {
    try {
      const postInDb = await this.postModel.findOne({ _id: postDto._id }).exec();

      if (postInDb) {
        throw new ConflictException('Запись уже существует!');
      }

      const post: PostModel = new this.postModel({
        ...postDto,
        countComments: 0,
        countLikes: 0,
      });

      return await post.save();
    } catch (err) {
      throw err;
    }
  }

  async update(userId: string, postDto: UpdatePostDto): Promise<IPosts> {
    try {
      const postInDb = await this.postModel.findOne({ _id: postDto._id }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена!`);
      }

      if (userId !== postInDb.author) {
        throw new BadRequestException('Нет доступа!');
      }

      await postInDb.updateOne({ ...postDto });

      return await postInDb.save();
    } catch (err) {
      throw err;
    }
  }

  async delete(userId: string, postDto: DeletePostDto): Promise<IRemoveEntity<IPosts>> {
    try {
      const postId = postDto._id;

      const deletedPost = await this.postModel.findOneAndDelete({ _id: postId }).exec();
      if (!deletedPost) {
        throw new EntityNotFoundError('Запись не найдена!');
      }

      if (userId !== deletedPost.author) {
        throw new BadRequestException('Нет доступа!');
      }

      return {
        acknowledged: true,
        deletedCount: 1,
        removed: { _id: deletedPost._id },
      };
    } catch (err) {
      throw err;
    }
  }

  async getPostById(userId: string, getPostParamsDto: GetPostParamsDto): Promise<IPosts> {
    try {
      const { _id } = getPostParamsDto;

      const user = await this.usersService.findOne({ _id: userId });
      if (!user) {
        throw new EntityNotFoundError('Пользователь не найден');
      }

      const postInDb = await this.postModel
        .findOne({ _id })
        .populate('author', '_id, first_name last_name avatar')
        .exec();
      if (!postInDb) {
        throw new EntityNotFoundError('Запись не найдена');
      }

      return postMapper(postInDb, user);
    } catch (err) {
      throw err;
    }
  }

  async uploadImages(uploadFilesDto: PostUploadDto, files: Express.Multer.File[]): Promise<IcPosts> {
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

  // async addView(postDto: UpdatePostDto): Promise<UpdatePostDto> {
  //   const { _id } = postDto;
  //   const postInDb = await this.postModel.findOne({ _id }).exec();

  //   if (!postInDb) {
  //     throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
  //   }

  //   if (isNaN(postInDb.views)) {
  //     await postInDb.updateOne({
  //       views: 1,
  //     });
  //   }

  //   if (!isNaN(postInDb.views)) {
  //     await postInDb.updateOne({
  //       views: postInDb.views + 1,
  //     });
  //   }

  //   await postInDb.save();
  //   const newPostInDb = await this.postModel.findOne({ _id }).exec();
  //   return newPostInDb;
  // }

  async liked(userId: string, postDto: GetPostParamsDto): Promise<IPosts> {
    try {
      const { _id } = postDto;

      const postInDb = await this.postModel.findOne({ _id }).exec();

      if (!postInDb) {
        throw new EntityNotFoundError(`Запись не найдена!`);
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
      return await this.postModel.findOne({ _id }).exec();
    } catch (err) {
      throw err;
    }
  }

  async createComment(createComments: IcPosts, paramPostId: GetPostParamsDto, userId: string): Promise<IcPosts> {
    const { cText, cImg } = createComments;
    const { _id } = paramPostId;
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Запись с id: ${_id} не найдена!`);
    }

    const comment: PostCommentsModel = new this.postCommentsModel({
      authorId: userId,
      cText,
      cImg,
      postID: paramPostId,
    });
    await comment.save();

    await postInDb.updateOne({
      countComments: postInDb.countComments + 1,
    });

    return comment;
  }

  async commentList(paramPostID: IcPosts): Promise<unknown> {
    const { _id } = paramPostID;
    const postInDb = await this.postModel.findOne({ paramPostID }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Запись с id: ${_id} не найден!`);
    }

    const comments = await this.postCommentsModel.find({ postID: _id });
    // const { authorId } = comments;
    return Promise.all(
      comments
        .map(async (comment) => {
          const commentAuthor = await this.usersService.findOne({
            _id: comment.authorId,
          });
          if (!commentAuthor) {
            return null;
          }
          return commentItemMapper(comment, commentAuthor);
        })
        .filter(Boolean),
    );
  }

  async commentLiked(post: any, comment_id: any, initUser: any): Promise<IcPosts> {
    const user = await this.usersService.findOne(initUser);

    const commentInDb = await this.postCommentsModel.findOne({ _id: comment_id }).exec();
    if (!commentInDb) {
      throw new EntityNotFoundError(`Коммент с id: ${comment_id}, не найден`);
    }
    const arrLikes = commentInDb.likes;
    let checkResult: boolean;

    if (arrLikes.length === 0) {
      await commentInDb.updateOne({
        likes: arrLikes.unshift(user._id),
        countLikes: 1,
      });
      await commentInDb.save();
      return await this.postCommentsModel.findOne({ _id: comment_id }).exec();
    }

    arrLikes.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await commentInDb.updateOne({
        likes: arrLikes.unshift(user._id),
        countLikes: commentInDb.countLikes + 1,
      });
      await commentInDb.save();
      return await this.postCommentsModel.findOne({ _id: comment_id }).exec();
    }

    if (checkResult === true) {
      const filteredArray = arrLikes.filter((f) => {
        return f != user._id.toString();
      });
      const count = filteredArray.length;
      await commentInDb.updateOne({
        likes: filteredArray,
        countLikes: count,
      });
      await commentInDb.save();
      const newCommentInDb = await this.postCommentsModel.findOne({ _id: comment_id }).exec();
      return {
        _id: newCommentInDb._id,
        likes: newCommentInDb.likes,
        countLikes: newCommentInDb.countLikes,
      };
    }
  }

  async updateComment(idComment: any, updateComment: IcPosts, initUser: any): Promise<IcPosts> {
    const { _id, cText, cImg } = updateComment;

    const postInDb = await this.postCommentsModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Комментарий с id: ${_id} не найден!`);
    }

    if (initUser.toString() !== postInDb.authorId) {
      throw new HttpException('Нет доступа!', HttpStatus.BAD_REQUEST);
    }

    await postInDb.updateOne({
      _id,
      cText,
      cImg,
    });
    await postInDb.save();
    return await this.postCommentsModel.findOne({ idComment }).exec();
  }

  async deleteComment(idComment: any, initUser: any, idPost: any): Promise<any> {
    const commentInDb = await this.postCommentsModel.findOne({ _id: idComment }).exec();

    if (!commentInDb) {
      throw new EntityNotFoundError(`Комментарий с id: ${idComment} не найден!`);
    } else if (initUser.toString() === commentInDb.authorId) {
      await commentInDb.deleteOne({
        _id: idComment,
      });
      await this.deleteMinus(idPost);

      if (!commentInDb) {
        throw new HttpException('Успешно удалено!', HttpStatus.NO_CONTENT);
      }

      return commentInDb;
    } else {
      throw new HttpException('Нет доступа!', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteMinus(idPost: any): Promise<any> {
    const postInDb = await this.postModel.findOne({ _id: idPost }).exec();

    await postInDb.updateOne({
      countComments: postInDb.countComments - 1,
    });
  }

  async addView(postDto: any, initUser: any): Promise<any> {
    const { _id } = postDto;

    const user = await this.usersService.findOne(initUser);
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Записб с id: ${_id} не найдена!`);
    }
    const arrViews = postInDb.views;

    let checkResult: boolean;
    if (arrViews.length === 0) {
      await postInDb.updateOne({
        views: arrViews.unshift(user._id),
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      const res = postMapper(newPostInDb, user);
      return res.views_count;
    }

    arrViews.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await postInDb.updateOne({
        views: arrViews.unshift(user._id),
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      const res = postMapper(newPostInDb, user);
      return res.views_count;
    }

    if (checkResult === true) {
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      const res = postMapper(newPostInDb, user);
      return res.views_count;
    }
  }
}
