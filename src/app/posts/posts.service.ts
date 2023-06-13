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
import { commentListMapper, postListMapper, postMapper } from './mapper';
import { PostCommentsModel } from './models/posts.comments.model';
import { PostModel } from './models/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(PostCommentsModel.name)
    private readonly postCommentsModel: Model<PostCommentsModel>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async getPostsList(initUsr: any): Promise<any> {
    const user = await this.usersService.findOne(initUsr.user._id);
    const posts = await this.postModel.find({}).sort({ createdAt: -1 });
    const res = postListMapper(posts, user);
    return res;
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
    }
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
      countComments: 0,
    });

    await post.save();

    return post;
  }

  async update(postDto: UpdatePostDto): Promise<UpdatePostDto> {
    const { _id, authorId, pText, stick, pImg, group } = postDto;

    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }

    if (authorId !== postInDb.authorId) {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
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

  async getPostById(getPostParamsDto: any, initUsr: any): Promise<any> {
    const _id = getPostParamsDto._id;
    const user = await this.usersService.findOne(initUsr.user._id);
    const postInDb = await this.postModel.findOne({ _id }).exec();
    if (!postInDb) {
      throw new EntityNotFoundError('пост не найден');
    }

    const res = postMapper(postInDb, user);
    return res;
  }

  async upImages(postDto: PostDto, file: any): Promise<PostDto> {
    const { _id, authorId } = postDto;
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }

    if (authorId !== postInDb.authorId) {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
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

  async addView(postDto: UpdatePostDto): Promise<UpdatePostDto> {
    const { _id } = postDto;
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }

    if (isNaN(postInDb.views)) {
      await postInDb.updateOne({
        views: 1,
      });
    }

    if (!isNaN(postInDb.views)) {
      await postInDb.updateOne({
        views: postInDb.views + 1,
      });
    }

    await postInDb.save();
    const newPostInDb = await this.postModel.findOne({ _id }).exec();
    return newPostInDb;
  }

  async liked(postDto: UpdatePostDto, initUser: any): Promise<UpdatePostDto> {
    const { _id } = postDto;

    const user = await this.usersService.findOne(initUser);
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }
    let arrLikes = postInDb.likes;

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
      let filteredArray = arrLikes.filter((f) => {
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
    paramPostID: GetPostParamsDto,
    initUser: any,
  ): Promise<IcPosts> {
    const { cText, cImg } = createComments;
    const { _id } = paramPostID;
    const postInDb = await this.postModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }

    const comment: PostCommentsModel = await new this.postCommentsModel({
      authorId: initUser,
      cText,
      cImg,
      postID: paramPostID,
    });
    await comment.save();

    await postInDb.updateOne({
      countComments: postInDb.countComments + 1,
    });

    return comment;
  }

  async CommentList(paramPostID: IcPosts, initUser: any): Promise<any> {
    const user = await this.usersService.findOne(initUser);
    const { _id } = paramPostID;
    console.log(_id);
    const postInDb = await this.postModel.findOne({ paramPostID }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Пост с id: ${_id}, не найден`);
    }

    const comments = await this.postCommentsModel.find({ postID: _id });
    const res = commentListMapper(comments, user);
    return res;
  }

  async Commentliked(post: any, comment: any, initUser: any): Promise<IcPosts> {
    const user = await this.usersService.findOne(initUser);

    const commentInDb = await this.postCommentsModel
      .findOne({ _id: comment })
      .exec();
    console.log(commentInDb);
    if (!commentInDb) {
      throw new EntityNotFoundError(`Коммент с id: ${comment}, не найден`);
    }
    let arrLikes = commentInDb.likes;
    let checkResult;

    if (arrLikes.length === 0) {
      await commentInDb.updateOne({
        likes: arrLikes.unshift(user._id),
        countLikes: 1,
      });
      await commentInDb.save();
      const newCommentInDb = await this.postCommentsModel
        .findOne({ _id: comment })
        .exec();
      return newCommentInDb;
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
      const newCommentInDb = await this.postCommentsModel
        .findOne({ _id: comment })
        .exec();
      return newCommentInDb;
    }

    if (checkResult === true) {
      let filteredArray = arrLikes.filter((f) => {
        return f != user._id.toString();
      });
      const count = filteredArray.length;
      await commentInDb.updateOne({
        likes: filteredArray,
        countLikes: count,
      });
      await commentInDb.save();
      const newCommentInDb = await this.postCommentsModel
        .findOne({ _id: comment })
        .exec();
      return {
        _id: newCommentInDb._id,
        likes: newCommentInDb.likes,
        countLikes: newCommentInDb.countLikes,
      };
    }
  }

  async updateComment(
    idComment: any,
    updateComment: IcPosts,
    initUser: any,
  ): Promise<IcPosts> {
    const { _id, cText, cImg } = updateComment;

    const postInDb = await this.postCommentsModel.findOne({ _id }).exec();

    if (!postInDb) {
      throw new EntityNotFoundError(`Коммент с id: ${_id}, не найден`);
    }

    if (initUser.toString() !== postInDb.authorId) {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }

    await postInDb.updateOne({
      _id,
      cText,
      cImg,
    });
    await postInDb.save();
    const newPostInDb = await this.postCommentsModel
      .findOne({ idComment })
      .exec();
    return newPostInDb;
  }

  async deleteComment(
    idComment: any,
    initUser: any,
    idPost: any,
  ): Promise<any> {
    const commentInDb = await this.postCommentsModel
      .findOne({ _id: idComment })
      .exec();

    if (!commentInDb) {
      throw new EntityNotFoundError('не найден пост для удаления');
    } else if (initUser.toString() === commentInDb.authorId) {
      await commentInDb.deleteOne({
        _id: idComment,
      });
      await this.deleteMinus(idPost);

      if (!commentInDb) {
        throw new HttpException('OK Deleted', HttpStatus.NO_CONTENT);
      }

      return commentInDb;
    } else {
      throw new HttpException('You are not author !', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteMinus(idPost: any): Promise<any> {
    const postInDb = await this.postModel.findOne({ _id: idPost }).exec();

    await postInDb.updateOne({
      countComments: postInDb.countComments - 1,
    });
  }
}
