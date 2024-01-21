import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from '../services/event.service';

@Controller('events-organized-by-user')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('userid') userId: number, @Query('page') page = 1) {
    return await this.eventService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit: 5,
    });
  }
}
