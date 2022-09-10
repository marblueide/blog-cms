export interface LiveSharedCreateInput {
  title: string;
  content?: string;
  tags: string[];
  weight?: number;
  address?: string;
  emotion?: string;
  file?: File;
}

export interface LiveSharedUpdateInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  weight?: number;
  address?: string;
  emotion?: string;
  file?: File;
}
