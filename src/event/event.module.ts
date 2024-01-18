import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventsController } from './events.controller';
import { EventEntity } from './entities/event.entity';
import { Attendee } from './entities/attendee.entity';
import { AttendeeService } from './attendee.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, Attendee])],
  providers: [EventService, AttendeeService],
  controllers: [EventsController],
})
export class EventModule {}
