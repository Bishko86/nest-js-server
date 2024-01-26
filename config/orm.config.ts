import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from 'src/auth/entities/profile.entity';
import { User } from 'src/auth/entities/user.entity';
import { Attendee } from 'src/event/entities/attendee.entity';
import { EventEntity } from 'src/event/entities/event.entity';
import { Menu } from 'src/menu/menu.entity';
import { DBType } from 'src/models/db-type.model';
import { Course } from 'src/school/entities/course.entity';
import { Subject } from 'src/school/entities/subject.entity';
import { Teacher } from 'src/school/entities/teacher.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as DBType,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
      Menu,
      EventEntity,
      Attendee,
      Subject,
      Teacher,
      User,
      Profile,
      Course,
    ],
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
