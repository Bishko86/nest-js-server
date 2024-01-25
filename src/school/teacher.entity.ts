import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Gender } from './school.types';

@Entity()
@ObjectType()
export class Teacher {
  constructor(partial: Partial<Teacher>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column({ nullable: true })
  @Field()
  name: string;

  @Column({
    type: 'text',
    default: Gender.Other,
  })
  @Field(() => Gender)
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject])
  subjects: Promise<Subject[]>;
}
