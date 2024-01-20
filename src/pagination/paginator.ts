import { SelectQueryBuilder } from 'typeorm';

import { PaginatorOptions, PaginatorResult } from 'src/models/paginator.model';

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginatorOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginatorResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

  return new PaginatorResult({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : null,
    data,
  });
}
