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
  UseGuards,
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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt';

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
  @UseGuards(AuthGuardJwt)
  create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  update(
    @Param('id') id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventService.updateEvent(id, input, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<DeleteResult> {
    return this.eventService.removeEvent(id, user);
  }
}
