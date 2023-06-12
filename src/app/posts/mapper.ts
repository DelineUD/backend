import { PostModel } from '../posts/models/posts.model';
import { IPosts } from './interfaces/posts.interface';
import { PostCommentsModel } from './models/posts.comments.model';

export const postListMapper = (posts: PostModel[], user: any): IPosts[] => {
  return posts.map((posts) => ({
    _id: posts._id,
    authorId: posts.authorId,
    pText: posts.pText,
    pImg: posts.pImg,
    countLikes: posts.countLikes,
    views: posts.views,
    isLiked: posts.likes.includes(user._id),
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    countComments: posts.countComments,
  }));
};

export const postMapper = (post: PostModel, user: any): IPosts => {
  return {
    _id: post._id,
    authorId: post.authorId,
    pText: post.pText,
    pImg: post.pImg,
    countLikes: post.countLikes,
    views: post.views,
    isLiked: post.likes.includes(user._id),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    countComments: post.countComments,
  };
};

export const commentListMapper = (
  postscomments: PostCommentsModel[],
  user: any,
): any => {
  return postscomments.map((postscomments) => ({
    authorId: user._id,
    authorAvatar: user.avatar ?? null,
    first_name: user.first_name ?? null,
    last_name: user.last_name ?? null,
    _id: postscomments._id ?? null,
    postID: postscomments.postID ?? null,
    cText: postscomments.cText ?? null,
    countLikes: postscomments.countLikes ?? null,
    isLiked: postscomments.likes.includes(user._id) ?? null,
    cImg: postscomments.cImg ?? null,
    createdAt: postscomments.createdAt ?? null,
    updatedAt: postscomments.updatedAt ?? null,
  }));
};
