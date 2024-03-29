export type Article = {
  id?: string;
  title?: string;
  pic?: string;
  viewNum?: number;
  summary?: string;
  content?: string;
  contentNum?: number;
  likes?: number;
  weight?: number;
  isPublic?: boolean;
  createTime?: string;
  updateTime?: string;
  tags?: Tag[];
  groups?: Group[];
  comments?: Comment[];
  type: Type
};

export enum TagType {
  Article = 1,
  PhotoWall,
  LiveShared,
  Multimedia,
}

export enum TagTypeColor {
  Article = "",
  PhotoWall = "success",
  LiveShared = "warning",
  Multimedia = "danger",
}

export const TagTypeList = [
  {
    key: "Article",
    value: 1,
  },
  {
    key: "PhotoWall",
    value: 2,
  },
  {
    key: "LiveShared",
    value: 3,
  },
  {
    key: "multimedia",
    value: 4,
  },
];

export type Tag = {
  id?: string;
  type?: TagsType;
  name?: string;
  nameEn?: string;
  weight?: number;
  createTime?: string;
  articles?: Article[];
  photoWalls?: PhotoWall[];
  liveShares?: LiveShared[];
  // multimedias?: Multimedia[];
};

export type TagsType = {
  id: string;
  name: string;
  Tags: Tag;
};

export type Group = {
  id?: number;
  name?: string;
  nameEn?: string;
  pic?: string;
  describe?: string;
  createTime?: string;
  articles?: Article[];
};

export type PhotoWall = {
  id?: string;
  name?: string;
  path?: string;
  originUrl?: string;
  author?: string;
  createTime?: string;
  tags?: Tag[];
  type?: Type;
};

export type Comment = {
  id?: string;
  name?: string;
  content?: string;
  email?: string;
  likes?: number;
  hasChildren?: boolean;
  browser?: string;
  envirconment?: string;
  visible?: boolean;
  createTime?: string;
  article?: Article;
  rootComment?: Comment;
  parentComment?: Comment;
  children?: Comment[];
  type?: CommentTypeEnum;
};

export enum CommentTypeEnum {
  article,
  commnet,
}

export type LiveShared = {
  id?: string;
  title?: string;
  content?: string;
  address?: string;
  emotion?: string;
  illustration?: string;
  weight?: number;
  createTime?: string;
  updateTime?: string;
  tags: Tag[];
};

export type Type = {
  id?: string;
  name?: string;
  nameEn?: string;
  describe?: string;
  createTime?: string;
  rootType?: Type;
  parentType?: Type;
  childType?: Type[];
  hasChildren?: boolean;
};

export type FriendsChain = {
  id?: string;
  name?: string;
  link?: string;
  imgSrc?: string;
  type?: FriendsChainType;
};

export type FriendsChainType = {
  id?: string;
  name?: string;
};

export const weightMax = 10;

export type Multimedia = {
  id?: string;
  title?: string;
  author?: string;
  path?: string;
  cover?: string;
  format?: string;
  outerLink?: string;
  weight?: number;
  createTime?: string;
  updateTime?: string;
  tags?: Tag[];
  type?: Type;
};
