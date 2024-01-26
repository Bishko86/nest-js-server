import { Type } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

export interface PaginatorOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

@InputType('paginatorOptions')
export class PaginatorInputOptions implements PaginatorOptions {
  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  currentPage: number;

  @Field({ nullable: true })
  total?: boolean;
}

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType()
  class PaginatorResult<T> {
    @Expose()
    @Field({ nullable: true })
    first: number;

    @Expose()
    @Field({ nullable: true })
    last: number;

    @Expose()
    @Field({ nullable: true })
    limit: number;

    @Expose()
    @Field({ nullable: true })
    total?: number;

    @Expose()
    @Field(() => [classRef], { nullable: true })
    data: T[];

    constructor(partial: Partial<PaginatorResult<T>>) {
      Object.assign(this, partial);
    }
  }

  return PaginatorResult<T>;
}
