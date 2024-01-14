import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from './event/event.entity';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      synchronize: true,
      entities: [Menu, EventEntity],
    }),
    MenuModule,
    EventModule,
  ],
})
export class AppModule {}
