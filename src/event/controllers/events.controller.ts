import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from '../input/create-event.dto';
import { UpdateEventDto } from '../input/update-event.dto';
import { EventEntity, PaginatedEvents } from '../entities/event.entity';
import { EventService } from '../services/event.service';
import { ListsEvents } from '../input/list.events';
import { DeleteResult } from 'typeorm';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListsEvents): Promise<PaginatedEvents> {
    const events =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );

    return events;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EventEntity> {
    return this.eventService.getEventWithAttendeeCout(id);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventService.updateEvent(id, input, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<DeleteResult> {
    return this.eventService.removeEvent(id, user);
  }
}
