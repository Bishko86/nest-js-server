import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from '../entities/course.entity';
import { Teacher } from '../entities/teacher.entity';
import { Subject } from '../entities/subject.entity';

@Resolver(() => Course)
export class CourseResolver {
  @ResolveField('teacher')
  public async teacher(@Parent() course: Course): Promise<Teacher> {
    return await course.teacher;
  }

  @ResolveField('subject')
  public async subject(@Parent() course: Course): Promise<Subject> {
    return await course.subject;
  }
}
