import { Expose } from 'class-transformer';

export interface PaginatorOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export class PaginatorResult<T> {
  @Expose()
  first: number;
  @Expose()
  last: number;
  @Expose()
  limit: number;
  @Expose()
  total?: number;
  @Expose()
  data: T[];

  constructor(partial: Partial<PaginatorResult<T>>) {
    Object.assign(this, partial);
  }
}
