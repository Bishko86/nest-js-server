import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Like,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { AttendeeService } from './attendee.service';
import { Attendee } from './entities/attendee.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';
import { ListsEvents } from './input/list.events';
import { WhenEventFilter } from 'src/enums/when-event.enum';
import { PaginatorOptions, PaginatorResult } from 'src/models/paginator.model';
import { paginate } from 'src/pagination/paginator';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private attendeeService: AttendeeService,
  ) {}

  private getEventtsBaseQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  async findAllEvents(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  async fetchAttendee(): Promise<Attendee[]> {
    return this.attendeeService.getAttendee();
  }

  //TODO remove later, is using for testing
  async practice2(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['attendees'],
    });

    const attendee = new Attendee();
    attendee.name = 'Maria';
    attendee.event = event;
    event.attendees.push(attendee);
    // await this.attendeeService.addAttendee(attendee);
    return this.eventRepository.save(event);
  }

  //TODO remove later, is using for testing
  async practice() {
    return await this.eventRepository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-17T13:00:00')),
        },
        {
          description: Like('%Bishko%'),
        },
      ],
      take: 3,
      order: {
        id: 'DESC',
      },
    });
  }

  async findEvent(id: number): Promise<EventEntity> {
    const event = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(event.getSql());

    if (!event) {
      throw new NotFoundException();
    }

    return await event.getOne();
  }

  //TODO refactor it
  getEventsWithAttendeeCountQuery() {
    return this.getEventtsBaseQuery()
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
  private async getEventsWithAttendeeCountFiltered(
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
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  async createEvent(
    event: CreateEventDto,
    organizer: User,
  ): Promise<EventEntity> {
    const eventDto = this.eventRepository.create({
      ...event,
      organizer,
      when: new Date(event.when),
    });

    return await this.eventRepository.save(eventDto);
  }

  async updateEvent(
    id: number,
    updateMenuDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id: id } });
    if (!event) {
      throw new NotFoundException();
    }

    Object.assign(event, updateMenuDto);
    return await this.eventRepository.save(event);
  }

  async removeEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
