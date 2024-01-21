import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeeService } from '../services/attendee.service';

@Controller('event/:eventId/attendees')
export class EventAttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number) {
    return this.attendeeService.findByEventId(eventId);
  }
}
