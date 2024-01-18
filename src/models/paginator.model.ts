export interface PaginatorOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export interface PaginatorResult<T> {
  first: number;
  last: number;
  limit: number;
  total?: number;
  data: T[];
}
