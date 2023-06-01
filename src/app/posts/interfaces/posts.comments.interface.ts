export interface IcPosts {
  _id?: string;

  postID?: string;

  authorId?: string;

  authorAvatar?: string;

  cText?: string;

  likes?: Array<string>;

  countLikes?: number;

  isLiked?: boolean;

  cImg?: Array<string>;

  createdAt?: Date;

  updatedAt?: Date;
}
