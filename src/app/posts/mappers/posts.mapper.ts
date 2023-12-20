import { IPostAuthorResponse, IPosts, IPostsResponse, PostUserPick } from '../interfaces/posts.interface';
import { IUser } from '@app/users/interfaces/user.interface';

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
    .map((post) => ({
      _id: post._id,
      pText: post.pText,
      pImg: post.pImg,
      countLikes: post.countLikes ?? 0,
      countComments: post.countComments ?? 0,
      views_count: post.views_count ?? 0,
      isViewed: post.views.includes(String(user._id)),
      isLiked: post.likes.includes(String(user._id)),
      group: post.group ?? 'Общее',
      author: toAuthorPost(post.author as PostUserPick),
      createdAt: String(post.createdAt),
      updatedAt: String(post.updatedAt),
    }))
    .filter((p) => p.author);
};

export const postMapper = (post: IPosts, user: IUser): IPostsResponse => {
  const { author, likes, views, ...postPayload } = JSON.parse(JSON.stringify(post)) as IPosts;

  return {
    _id: postPayload._id,
    pText: postPayload.pText,
    pImg: postPayload.pImg,
    countLikes: postPayload.countLikes ?? 0,
    views_count: views.length ?? 0,
    countComments: postPayload.countComments ?? 0,
    group: postPayload.group ?? 'Общее',
    isViewed: views.includes(String(user._id)),
    isLiked: likes.includes(String(user._id)),
    createdAt: String(post.createdAt),
    updatedAt: String(post.updatedAt),
    author: toAuthorPost(post.author as PostUserPick),
  };
};
