import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuModule } from './menu/menu.module';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from '../config/orm.config';
import ormConfigProd from '../config/orm.config.prod';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    AuthModule,
    MenuModule,
    EventModule,
    SchoolModule,
  ],
})
export class AppModule {}
