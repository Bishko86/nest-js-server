import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@ObjectType()
export class EntityWithId {
  @Field(() => Int)
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

registerEnumType(Gender, { name: 'Gender' });
