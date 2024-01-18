import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuModule } from './menu/menu.module';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from 'config/orm.config';
import ormConfigProd from 'config/orm.config.prod';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    MenuModule,
    EventModule,
    SchoolModule,
  ],
})
export class AppModule {}
