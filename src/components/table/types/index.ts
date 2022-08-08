export interface TableHeaderPropType {
  editDisabled: boolean;
  deleteDisabled: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  dropdownLable?: string;
  dropdownValue?: string;
  dropdownData?: any[];
}

export interface TableHeaderEmitType {
  (e: "refreshClick"): void;
  (e: "addClick"): void;
  (e: "editClick"): void;
  (e: "deleteClick"): void;
  (e: "update:searchValue", event: any): void;
  (e: "searchChange", value: string): void;
}

export interface PaginationPropType {
  currentPage: number;
  pageSize: number;
  total: number;
  background?: boolean;
}

export interface PaginationEmitType {
  (e: "sizeChange", sizePage: number): void;
  (e: "currentChange", currentSize: number): void;
}
