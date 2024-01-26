import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { CreateEventDto } from '../input/create-event.dto';
import { UpdateEventDto } from '../input/update-event.dto';
import { AttendeeService } from './attendee.service';
import { Attendee } from '../entities/attendee.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';
import { ListsEvents } from '../input/list.events';
import { WhenEventFilter } from 'src/enums/when-event.enum';
import { PaginatorOptions, PaginatorResult } from 'src/models/paginator.model';
import { paginate } from 'src/pagination/paginator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private attendeeService: AttendeeService,
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<EventEntity> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  private getEventsOrganizedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<EventEntity> {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  private getEventsAttendedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<EventEntity> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
  }

  async findAllEvents(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  async fetchAttendee(): Promise<Attendee[]> {
    return this.attendeeService.getAttendee();
  }

  async getEventWithAttendeeCout(id: number): Promise<EventEntity> {
    const eventQuery = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    const event = await eventQuery.getOne();

    this.logger.debug(eventQuery.getSql());

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  async findOne(id: number): Promise<EventEntity | undefined> {
    return await this.eventRepository.findOne({ where: { id } });
  }

  //TODO refactor it
  getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeDeclined',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Declined,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeePending',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswer.Pending,
          }),
      );
  }

  //TODO refactor it
  private async getEventsWithAttendeeCountFilteredQuery(
    filter?: ListsEvents,
  ): Promise<SelectQueryBuilder<EventEntity>> {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if ((filter.when as WhenEventFilter) === WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= DATE('now') AND e.when <= DATE('now', '+1 day')`,
        );
      }

      if ((filter.when as WhenEventFilter) === WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= DATE('now', '+1 day') AND e.when <= DATE('now', '+2 days')`,
        );
      }

      if ((filter.when as WhenEventFilter) === WhenEventFilter.ThisWeek) {
        query = query.andWhere(
          `strftime('%Y-%W', e.when) = strftime('%Y-%W', 'now')`,
        );
      }

      if ((filter.when as WhenEventFilter) === WhenEventFilter.NextWeek) {
        this.logger.log(filter.when);
        query = query.andWhere(
          `strftime('%Y-%W', e.when) = strftime('%Y-%W', 'now', '+1 day', 'weekday 1')`,
        );
      }
    }

    return query;
  }

  async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListsEvents,
    paginateOptions: PaginatorOptions,
  ): Promise<PaginatorResult<EventEntity>> {
    return await paginate(
      await this.getEventsWithAttendeeCountFilteredQuery(filter),
      paginateOptions,
    );
  }

  async createEvent(
    event: CreateEventDto,
    organizer: User,
  ): Promise<EventEntity> {
    const eventDto = this.eventRepository.create(
      new EventEntity({
        ...event,
        organizer,
        when: new Date(event.when),
      }),
    );

    return await this.eventRepository.save(eventDto);
  }

  async updateEvent(
    id: number,
    updateMenuDto: UpdateEventDto,
    user: User,
  ): Promise<EventEntity> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this event',
      );
    }

    const eventPayload = new EventEntity(Object.assign(event, updateMenuDto));
    return await this.eventRepository.save(eventPayload);
  }

  async removeEvent(id: number, user: User): Promise<DeleteResult> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to delete this event',
      );
    }

    const deleteResult = await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();

    return deleteResult;
  }

  async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginatorOptions,
  ): Promise<PaginatorResult<EventEntity>> {
    return await paginate<EventEntity>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions,
    );
  }

  async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginatorOptions,
  ): Promise<PaginatorResult<EventEntity>> {
    return await paginate<EventEntity>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions,
    );
  }
}
