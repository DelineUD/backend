import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityNotFoundError } from '../shared/interceptors/not-found.interceptor';
import { UsersService } from '../users/users.service';
import { DeletePostDto } from './dto/delete.post.dto';
import { GetPostParamsDto } from './dto/get-post-params.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { IcPosts } from './interfaces/posts.comments.interface';
import { commentItemMapper, postListMapper, postMapper } from './mapper';
import { PostCommentsModel } from './models/posts.comments.model';
import { PostModel } from './models/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name)
    private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly usersService: UsersService,
  ) {}

  async getPostsList(initUsr: any, search: any, lastIndex: string, group: any): Promise<any> {
    let sorted;
    const user = await this.usersService.findOne(initUsr.user._id);
    if (search !== undefined && lastIndex === undefined) {
      const postsFind = await this.postModel.find({}).sort({ createdAt: -1 });
      if (group === undefined) {
        sorted = postsFind.filter((el) => el.pText.toLowerCase().includes(search.toLowerCase()));
      }
      if (group !== undefined) {
        sorted = postsFind.filter(
          (el) =>
            el.pText.toLowerCase().includes(search.toLowerCase()) &&
            el.group !== undefined &&
            el.group.includes(group),
        );
      }

      const sortedLimit = sorted.slice(0, 10);
      if (sortedLimit.length < 1) {
        [];
      }
      return postListMapper(sortedLimit, user);
    }

    if (search !== undefined && lastIndex !== undefined) {
      const postsFind = await this.postModel.find({}).sort({ createdAt: -1 });
      if (group === undefined) {
        sorted = postsFind.filter((el) => el.pText.toLowerCase().includes(search.toLowerCase()));
      }
      if (group !== undefined) {
        sorted = postsFind.filter(
          (el) =>
            el.pText.toLowerCase().includes(search.toLowerCase()) &&
            el.group !== undefined &&
            el.group.includes(group),
        );
      }
      const newArr = [];
      let i;
      sorted.forEach(async (elem) => {
        if (elem._id.toString() === lastIndex.toString()) {
          i = sorted.indexOf(elem);
        }
        if (i !== undefined) {
          return i;
        }
      });

      if (i !== undefined) {
        sorted.forEach(async (elem) => {
          if (sorted.indexOf(elem) > i && sorted.indexOf(elem) < i + 10) {
            newArr.push(elem);
          }
        });
      }

      if (newArr.length < 1) {
        [];
      }

      const res = postListMapper(newArr, user);
      return res;
    }
    //красавчик
    if (lastIndex === undefined && search === undefined) {
      if (group === undefined) {
        const postsStart = await this.postModel.find({}).limit(10).sort({ createdAt: -1 });
        const res = postListMapper(postsStart, user);
        return res;
      }

      if (group !== undefined) {
        const postsStart = await this.postModel
          .find({ group: group })
          .limit(10)
          .sort({ createdAt: -1 });
        const res = postListMapper(postsStart, user);
        return res;
      }
    }

    if (lastIndex !== undefined && search === undefined) {
      if (group === undefined) {
        const sposts = await this.postModel
          .find({
            _id: { $lt: lastIndex },
          })
          .limit(10)
          .sort({ createdAt: -1 });
        if (sposts) {
          return postListMapper(sposts, user);
        } else {
          [];
        }
      }

      if (group !== undefined) {
        const sposts = await this.postModel
          .find({
            _id: { $lt: lastIndex },
            group: group,
          })
          .limit(10)
          .sort({ createdAt: -1 });
        if (sposts) {
          return postListMapper(sposts, user);
        } else {
          [];
        }
      }
    }
  }

  async create(postDto: PostDto): Promise<PostDto> {
    const { _id, createdAt, updatedAt, authorId, pText, pImg, likes, views, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (postInDb) {
      throw new HttpException('Запись уже существует!', HttpStatus.BAD_REQUEST);
    }
    const post: PostModel = new this.postModel({
      authorId,
      createdAt,
      updatedAt,
      pText,
      pImg,
      likes,
      views,
      group,
      countComments: 0,
    });

    await post.save();

    return post;
  }

  async update(postDto: UpdatePostDto): Promise<UpdatePostDto> {
    const { _id, authorId, pText, stick, pImg, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Запись с id: ${_id} не найдена!`);
    }

    if (authorId !== postInDb.authorId) {
      throw new HttpException('Нет доступа!', HttpStatus.BAD_REQUEST);
    }

    await postInDb.updateOne({
      _id,
      authorId,
      pText,
      stick,
      group,
      pImg,
    });
    await postInDb.save();
    const newPostInDb = await this.postModel.findOne({ _id }).exec();
    return newPostInDb;
  }

  async delete(postDto: DeletePostDto): Promise<DeletePostDto> {
    const { _id, authorId } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new EntityNotFoundError('Запись не найдена!');
    } else if (authorId === postInDb.authorId) {
      await postInDb.deleteOne({
        _id,
      });

      if (postInDb) {
        throw new HttpException('Успешно удалено!', HttpStatus.NO_CONTENT);
      }

      return postInDb;
    } else {
      throw new HttpException('Нет доступа!', HttpStatus.BAD_REQUEST);
    }
  }

  async getPostById(getPostParamsDto: any, initUsr: any): Promise<any> {
    const _id = getPostParamsDto._id;
    const user = await this.usersService.findOne(initUsr.user._id);
    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new EntityNotFoundError('Запись не найдена!');
    }

    const res = postMapper(postInDb, user);
    return res;
  }

  async upImages(postDto: PostDto, file: any): Promise<PostDto> {
    const { _id, authorId } = postDto;
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Запись с id: ${_id} не найдена!`);
    }

    if (authorId !== postInDb.authorId) {
      throw new HttpException('Нет доступа!', HttpStatus.BAD_REQUEST);
    }

    if (file?.length && !postInDb.pImg.length) {
      await postInDb.updateOne({
        pImg: file,
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      return newPostInDb;
    }

    if (file?.length && postInDb.pImg?.length) {
      const newArray = [].concat(postInDb.pImg, file);
      await postInDb.updateOne({
        pImg: newArray,
      });

      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      return newPostInDb;
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

  async liked(postDto: UpdatePostDto, initUser: any): Promise<UpdatePostDto> {
    const { _id } = postDto;

    const user = await this.usersService.findOne(initUser);
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Запись с id: ${_id} не найдена!`);
    }
    const arrLikes = postInDb.likes;

    let checkResult;
    if (arrLikes.length === 0) {
      await postInDb.updateOne({
        likes: arrLikes.unshift(user._id),
        countLikes: 1,
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      return newPostInDb;
    }

    arrLikes.forEach((item) => {
      if (item.toString() === user._id.toString()) {
        checkResult = true;
      }
    });

    if (checkResult !== true) {
      await postInDb.updateOne({
        likes: arrLikes.unshift(user._id),
        countLikes: postInDb.countLikes + 1,
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      return newPostInDb;
    }

    if (checkResult === true) {
      const filteredArray = arrLikes.filter((f) => {
        return f != user._id.toString();
      });
      const count = filteredArray.length;
      await postInDb.updateOne({
        likes: filteredArray,
        countLikes: count,
      });
      await postInDb.save();
      const newPostInDb = await this.postModel.findOne({ _id }).exec();
      return {
        _id: newPostInDb._id,
        likes: newPostInDb.likes,
        countLikes: newPostInDb.countLikes,
      };
    }
  }

  async createComment(
    createComments: IcPosts,
    paramPostId: GetPostParamsDto,
    userId: string,
  ): Promise<IcPosts> {
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
