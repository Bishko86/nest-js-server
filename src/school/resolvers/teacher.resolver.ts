import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Teacher } from '../entities/teacher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherAddInput } from '../input/teacher-add.input';
import { Logger, UseGuards } from '@nestjs/common';
import { Subject } from '../entities/subject.entity';
import { TeacherEditInput } from '../input/teacher-edit.input';
import { EntityWithId } from '../school.types';
import { AuthGuardJwtGql } from 'src/auth/guards/auth-guard-jwt.gql';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}
  @Query(() => [Teacher])
  async teachers(): Promise<Teacher[]> {
    return await this.teachersRepository.find();
  }

  @Query(() => Teacher)
  async teacher(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<Teacher> {
    return await this.teachersRepository.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  @UseGuards(AuthGuardJwtGql)
  async add(
    @Args('input', { type: () => TeacherAddInput }) input: TeacherAddInput,
  ): Promise<Teacher> {
    return await this.teachersRepository.save(new Teacher(input));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  async edit(
    @Args('id', { type: () => Int }) id: number,
    @Args('input', { type: () => TeacherEditInput }) input: TeacherEditInput,
  ): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: { id },
    });
    return await this.teachersRepository.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: { id },
    });

    await this.teachersRepository.remove(teacher);

    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  async subjects(@Parent() teacher: Teacher): Promise<Subject[]> {
    this.logger.debug('@Resolved subjects was called');
    return await teacher.subjects;
  }
}
