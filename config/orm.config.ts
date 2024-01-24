import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from 'src/auth/profile.entity';
import { User } from 'src/auth/user.entity';
import { Attendee } from 'src/event/entities/attendee.entity';
import { EventEntity } from 'src/event/entities/event.entity';
import { Menu } from 'src/menu/menu.entity';
import { DBType } from 'src/models/db-type.model';
import { Subject } from 'src/school/subject.entity';
import { Teacher } from 'src/school/teacher.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as DBType,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [Menu, EventEntity, Attendee, Subject, Teacher, User, Profile],
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
