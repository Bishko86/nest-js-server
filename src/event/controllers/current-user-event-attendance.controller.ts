import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { AttendeeService } from '../services/attendee.service';
import { CreateAttendeeDto } from '../input/create-attendee.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt';
import { User } from 'src/auth/user.entity';
import { Attendee } from '../entities/attendee.entity';
import { PaginatorResult } from 'src/models/paginator.model';
import { EventEntity } from '../entities/event.entity';

@Controller('events-attendance')
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventService: EventService,
    private readonly attendeeService: AttendeeService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ): Promise<PaginatorResult<EventEntity>> {
    return await this.eventService.getEventsAttendedByUserIdPaginated(user.id, {
      limit: 6,
      currentPage: page,
    });
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ): Promise<Attendee> {
    const attendee = await this.attendeeService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ): Promise<Attendee> {
    return this.attendeeService.createOrUpdate(input, eventId, user);
  }
}
