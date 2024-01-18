import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventService } from './event.service';
import { ListsEvents } from './input/list.events';
import { PaginatorResult } from 'src/models/paginator.model';
import { DeleteResult } from 'typeorm';

  //TODO refactor it
@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() filter: ListsEvents,
  ): Promise<PaginatorResult<EventEntity>> {
    this.logger.log(`Hit the findAll route`, filter);
    const events =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );
    this.logger.debug(`Found ${events.data.length} events`);
    return events;
  }

  @Get('/practice') //TODO remove later, is using for dev testing
  async practice() {
    return this.eventService.practice();
  }
  @Get('/test/:id') //TODO remove later, is using for dev testing
  async practice2(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.practice2(id);
  }

  @Get('att')
  async getAttendee() {
    return this.eventService.fetchAttendee();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EventEntity> {
    return this.eventService.findEvent(id);
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
  update(@Param('id') id: number, @Body() input: UpdateEventDto) {
    return this.eventService.updateEvent(id, input);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    const result = await this.eventService.removeEvent(id);

    if (result?.affected !== 1) {
      throw new NotFoundException();
    }

    return result;
  }
}
