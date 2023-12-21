import { IPostAuthorResponse, IPosts, IPostsResponse, PostUserPick } from '../interfaces/posts.interface';
import { IUser } from '@app/users/interfaces/user.interface';
import { GroupFilterKeys } from '@app/filters/consts';

const toAuthorPost = (author: PostUserPick): IPostAuthorResponse => {
  return author
    ? {
        _id: author?._id,
        first_name: author?.first_name,
        last_name: author?.last_name,
        avatar: author?.avatar ?? null,
      }
    : null;
};

export const postListMapper = (posts: IPosts[], user: IUser): IPostsResponse[] => {
  const postsPayload = JSON.parse(JSON.stringify(posts)) as IPosts[];

  return postsPayload
    .map(({ likes, views, ...post }) => ({
      _id: post._id,
      pText: post.pText,
      pImg: post.pImg,
      countComments: post.countComments ?? 0,
      countLikes: likes.length ?? 0,
      countViews: views.length ?? 0,
      isViewed: views.includes(String(user._id)),
      isLiked: likes.includes(String(user._id)),
      group: post.group ?? GroupFilterKeys.pf001,
      author: toAuthorPost(post.author as PostUserPick),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))
    .filter((p) => p.author);
};

export const postMapper = (post: IPosts, user: IUser): IPostsResponse => {
  const { author, likes, views, ...postPayload } = JSON.parse(JSON.stringify(post)) as IPosts;

  return {
    _id: postPayload._id,
    pText: postPayload.pText,
    pImg: postPayload.pImg,
    countComments: post.countComments ?? 0,
    countLikes: likes.length ?? 0,
    countViews: views.length ?? 0,
    group: postPayload.group ?? GroupFilterKeys.pf001,
    isViewed: views.includes(String(user._id)),
    isLiked: likes.includes(String(user._id)),
    author: toAuthorPost(author as PostUserPick),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
