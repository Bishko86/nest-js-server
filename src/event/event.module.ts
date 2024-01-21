import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './services/event.service';
import { EventsController } from './controllers/events.controller';
import { EventEntity } from './entities/event.entity';
import { Attendee } from './entities/attendee.entity';
import { AttendeeService } from './services/attendee.service';
import { EventAttendeeController } from './controllers/event-attendee.controller';
import { EventsOrganizedByUserController } from './controllers/events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './controllers/current-user-event-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, Attendee])],
  providers: [EventService, AttendeeService],
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeeController,
    EventsOrganizedByUserController,
  ],
})
export class EventModule {}
