import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/auth/user.entity';
import { Profile } from 'src/auth/profile.entity';
import { TeacherResolver } from './resolvers/teacher.resolver';
import { CourseResolver } from './resolvers/course.resolver';
import { SubjectResolver } from './resolvers/subject.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, User, Profile])],
  providers: [TeacherResolver, SubjectResolver, CourseResolver],
})
export class SchoolModule {}
