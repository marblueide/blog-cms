export type Article = {
  id?: string;
  title?: string;
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
  comments: Comment[];
};

export enum TagType {
  Article = 1,
  PhotoWall,
  LiveShared,
  Multimedia,
}

export enum TagTypeColor {
  Article = "primary",
  PhotoWall = "success",
  LiveShared = "info",
  Multimedia = "warning",
}

export type Tag = {
  id?: string;
  type?: TagType;
  name?: string;
  nameEn?: string;
  weight?: number;
  createTime?: string;
  articles?: Article[];
  photoWalls?: PhotoWall[];
  liveShares?: LiveShared[];
  // multimedias?: Multimedia[];
};

export type Group = {
  id?: string;
  name?: string;
  nameEn?: string;
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
  tags: Tag[];
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
};

export type LiveShared = {
  id?: string;
  content?: string;
  address?: string;
  emotion?: string;
  illustration?: string;
  weight?: number;
  createTime?: string;
  updateTime?: string;
  tags: Tag[];
};