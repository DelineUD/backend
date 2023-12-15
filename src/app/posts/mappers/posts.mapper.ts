import { IPosts } from '../interfaces/posts.interface';
import { PostModel } from '@app/posts/models/posts.model';
import { IUser } from '@app/users/interfaces/user.interface';

export const postListMapper = (posts: IPosts[], user: IUser): IPosts[] => {
  return posts
    .map((posts) => ({
      _id: posts._id,
      author: {
        _id: posts.author?._id,
        first_name: posts.author?.first_name,
        last_name: posts.author?.last_name,
        avatar: posts.author?.avatar ?? null,
      },
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
    }))
    .filter((post) => post.author);
};

export const postMapper = (post: PostModel, user: IUser): IPosts => {
  return {
    _id: post._id,
    author: {
      _id: post.author._id,
      first_name: post.author.first_name,
      last_name: post.author.last_name,
      avatar: post.author.avatar ?? null,
    },
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
