import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';

@Controller('/events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAllEvents();
  }

  @Get('/practice') //TODO remove later, is using for dev testing
  async practice() {
    return this.eventService.practice();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EventEntity> {
    return this.eventService.findEvent(+id);
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
    };

    return this.eventService.createEvent(event);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    return this.eventService.updateEvent(+id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.eventService.removeEvent(+id);
  }
}
