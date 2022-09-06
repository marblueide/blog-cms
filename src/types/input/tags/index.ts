import { TagsType } from "@/types/entity";

export interface TagsCreateInput {
  name: string,
  nameEn?: string,
  type: TagsType | string,
  weight?: number
}