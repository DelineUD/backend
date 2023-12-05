import { UserModel } from '../users/models/user.model';
import { IPosts } from './interfaces/posts.interface';
import { PostModel } from '@app/posts/models/posts.model';

export const postListMapper = (posts: IPosts[], user: UserModel): IPosts[] => {
  return posts.map((posts) => ({
    _id: posts._id,
    author: posts.author,
    pText: posts.pText,
    pImg: posts.pImg,
    countLikes: posts.countLikes ?? 0,
    views_count: posts.views.length,
    isLiked: posts.likes.includes(String(user._id)),
    isViewed: posts.views.includes(String(user._id)),
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    countComments: posts.countComments,
    group: posts.group,
  }));
};

export const postMapper = (post: PostModel, user: UserModel): IPosts => {
  return {
    _id: post._id,
    author: post.author,
    pText: post.pText,
    pImg: post.pImg,
    countLikes: post.countLikes ?? 0,
    views_count: post.views.length,
    isViewed: post.views.includes(String(user._id)),
    isLiked: post.likes.includes(String(user._id)),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    countComments: post.countComments,
  };
};
