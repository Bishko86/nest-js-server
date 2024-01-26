import { SelectQueryBuilder } from 'typeorm';

import { PaginatorOptions } from 'src/models/paginator.model';
import { Type } from '@nestjs/common';

export async function paginate<T, K>(
  qb: SelectQueryBuilder<T>,
  classRef: Type<K>,
  options?: PaginatorOptions,
): Promise<K> {
  const { currentPage = 1, limit = 10, total = false } = options;
  const offset = (currentPage - 1) * limit;
  const data = await qb.limit(limit).offset(offset).getMany();

  return new classRef({
    first: offset + 1,
    last: offset + data.length,
    limit: limit,
    total: total ? await qb.getCount() : null,
    data,
  });
}
