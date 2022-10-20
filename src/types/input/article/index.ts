export interface ArticleUpdateInput {
  id: string
  weight?: number
  title?: string
  summary?: string
  content?: string
  isPublic?: boolean
  tags?: string[]
  groups?: string[]
  file?: File
  type?: string
}

export interface ArticleCreateInput {
  title?: string
  weight?: number
  summary?: string
  content?: string
  isPublic?: boolean
  tags?: string[]
  groups?: string[]
  file?: File;
  type?: string
}