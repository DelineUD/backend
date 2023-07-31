import { PostModel } from '../posts/models/posts.model';
import { UserModel } from '../users/models/user.model';
import { IPosts } from './interfaces/posts.interface';
import { PostCommentsModel } from './models/posts.comments.model';

export const postListMapper = (posts: PostModel[], user: any): IPosts[] => {
  return posts.map((posts) => ({
    _id: posts._id,
    authorId: posts.authorId,
    pText: posts.pText,
    pImg: posts.pImg,
    countLikes: posts.countLikes ?? 0,
    views_count: posts.views.length,
    isLiked: posts.likes.includes(user._id),
    isViewed: posts.views.includes(user._id) ? true : false,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    countComments: posts.countComments,
    group: posts.group,
  }));
};

export const postMapper = (post: PostModel, user: any): IPosts => {
  return {
    _id: post._id,
    authorId: post.authorId,
    pText: post.pText,
    pImg: post.pImg,
    countLikes: post.countLikes ?? 0,
    views_count: post.views.length,
    isViewed: post.views.includes(user._id) ? true : false,
    isLiked: post.likes.includes(user._id),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    countComments: post.countComments,
  };
};

export const commentItemMapper = (
  postscomments: PostCommentsModel,
  commenetAuthor: UserModel,
) => {
  return {
    authorId: commenetAuthor._id,
    authorAvatar: commenetAuthor.avatar,
    first_name: commenetAuthor.first_name ?? null,
    last_name: commenetAuthor.last_name ?? null,
    _id: postscomments._id ?? null,
    postID: postscomments.postID ?? null,
    cText: postscomments.cText ?? null,
    countLikes: postscomments.countLikes ?? 0,
    isLiked: postscomments.likes.includes(commenetAuthor._id) ?? null,
    cImg: postscomments.cImg ?? null,
    createdAt: postscomments.createdAt ?? null,
    updatedAt: postscomments.updatedAt ?? null,
  };
};
