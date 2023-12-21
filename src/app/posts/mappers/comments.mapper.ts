import { Types } from 'mongoose';

import {
  ICPosts,
  ICPostsAuthorResponse,
  ICPostsResponse,
  UserCPostsPick,
} from '@app/posts/interfaces/posts.comments.interface';

const toCommentsAuthor = (author: UserCPostsPick): ICPostsAuthorResponse => {
  return author
    ? {
        _id: author?._id ?? null,
        first_name: author?.first_name ?? null,
        last_name: author?.last_name ?? null,
        avatar: author?.avatar ?? null,
      }
    : null;
};

export const commentListMapper = (comments: ICPosts[], userId: Types.ObjectId): ICPostsResponse[] => {
  return comments
    .map((comment) => ({
      _id: comment._id,
      author: toCommentsAuthor(comment.author as UserCPostsPick),
      cText: comment.cText,
      cImg: comment.cImg,
      countLikes: comment.countLikes ?? 0,
      isLiked: comment.likes.includes(String(userId)),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }))
    .filter((c) => c.author);
};
