export type Pagination<T> = {
  totalCount: number;
  nodes: T[];
};


export type StatusModel = {
  code:number,
  msg:string
}

export type FromType = 'add' | 'editor' | ''