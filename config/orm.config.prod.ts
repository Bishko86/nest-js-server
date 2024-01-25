import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { EventEntity } from 'src/event/entities/event.entity';
import { Menu } from 'src/menu/menu.entity';
import { DBType } from 'src/models/db-type.model';
import { Teacher } from 'src/school/entities/teacher.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as DBType,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [Menu, EventEntity, Subject, Teacher],
    dropSchema: false,
  }),
);
