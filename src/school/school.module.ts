import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { User } from 'src/auth/user.entity';
import { Profile } from 'src/auth/profile.entity';
import { TeacherResolver } from './teacher.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, User, Profile])],
  providers: [TeacherResolver],
})
export class SchoolModule {}
