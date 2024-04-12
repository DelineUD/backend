import { IPostAuthorResponse, IPosts, IPostsResponse, PostUserPick } from '../interfaces/posts.interface';
import { IUser } from '@app/users/interfaces/user.interface';
import { GroupFilterKeys } from '@app/filters/consts';

const toAuthorPost = (author: PostUserPick, youBlocked: boolean): IPostAuthorResponse => {
  return author
    ? {
        _id: author?._id,
        first_name: author?.first_name,
        last_name: author?.last_name,
        avatar: !youBlocked ? author?.avatar ?? null : null,
      }
    : null;
};

export const postListMapper = (posts: IPosts[], user: IUser): IPostsResponse[] => {
  return posts.map((p) => postsMapper(p, user));
};

const postsMapper = (post: IPosts, user: Pick<IUser, '_id' | 'blocked_users'>) => {
  const youBlocked = post.author.blocked_users.includes(user._id) ?? false;

  if (!post.author) {
    return null;
  }

  return {
    _id: post._id,
    pText: post.pText,
    pImg: post.pImg,
    countComments: post.countComments ?? 0,
    countLikes: post.likes.length ?? 0,
    countViews: post.views.length ?? 0,
    isViewed: post.views.includes(String(user._id)),
    isLiked: post.likes.includes(String(user._id)),
    group: post.group ?? GroupFilterKeys.pf001,
    publishInProfile: post.publishInProfile ?? false,
    author: toAuthorPost(post.author as PostUserPick, youBlocked),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

export const postMapper = (post: IPosts, user: Pick<IUser, '_id' | 'blocked_users'>): IPostsResponse => {
  const { _id, pText, countComments, group, pImg, publishInProfile, createdAt, updatedAt, author, likes, views } = post;
  const youBlocked = post.author.blocked_users.includes(user._id) ?? false;

  return {
    _id,
    pText,
    pImg,
    countComments: countComments ?? 0,
    countLikes: likes.length ?? 0,
    countViews: views.length ?? 0,
    group: group ?? GroupFilterKeys.pf001,
    isViewed: views.includes(String(user._id)),
    isLiked: likes.includes(String(user._id)),
    author: toAuthorPost(author as PostUserPick, youBlocked),
    publishInProfile: publishInProfile ?? false,
    createdAt,
    updatedAt,
  };
};
