export interface GroupCreateInput {
  name: string;
  nameEn?: string;
  describe?: string;
  file?: File;
}

export interface GroupUpdateInput {
  id: number;
  name: string;
  nameEn?: string;
  describe?: string;
  file?: File;
}
