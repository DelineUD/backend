import { Types } from 'mongoose';

import { ICPosts, ICPostsResponse } from '@app/posts/interfaces/posts.comments.interface';

export const commentListMapper = (comments: ICPosts[], userId: Types.ObjectId): ICPostsResponse[] => {
  return comments
    .map((comment) => ({
      _id: comment._id,
      author: {
        _id: comment.author?._id,
        first_name: comment.author?.first_name,
        last_name: comment.author?.last_name,
        avatar: comment.author?.avatar ?? null,
      },
      cText: comment.cText,
      cImg: comment.cImg,
      countLikes: comment.countLikes ?? 0,
      isLiked: comment.likes.includes(String(userId)),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }))
    .filter((comment) => comment.author);
};
