import { PostModel } from '../posts/models/posts.model';
import { IPosts } from './interfaces/posts.interface';

export const postListMapper = (post: PostModel[]): IPosts[] => {
  return post.map((post) => ({
    _id: post._id,
    authorId: post.authorId,
    pText: post.pText,
    stick: post.stick,
    pImg: post.pImg,
    likes: post.likes,
    views: post.views,
    group: post.group,
  }));
};
