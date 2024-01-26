import { DeleteResult, Repository } from 'typeorm';
import { EventService } from '../services/event.service';
import { EventsController } from './events.controller';
import { EventEntity } from '../entities/event.entity';
import { AttendeeService } from '../services/attendee.service';
import { ListsEvents } from '../input/list.events';
import { PaginatorResult } from 'src/models/paginator.model';
import { User } from 'src/auth/entities/user.entity';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventRepository: Repository<EventEntity>;
  let attendeeService: AttendeeService;
  let eventService: EventService;

  beforeAll(() => {
    console.log('this is run only once');
  });

  beforeEach(() => {
    eventService = new EventService(eventRepository, attendeeService);
    eventsController = new EventsController(eventService);
  });

  it('should return a list of events', async () => {
    const result: PaginatorResult<EventEntity> = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    // eventService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): PaginatorResult<EventEntity> => result);

    const spy = jest
      .spyOn(eventService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation(
        async (): Promise<PaginatorResult<EventEntity>> => result,
      );

    expect(await eventsController.findAll(new ListsEvents())).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should not delete an Event, when it's not found", async () => {
    const user = new User({ username: 'Doe' });
    const deleteSpy = jest
      .spyOn(eventService, 'removeEvent')
      .mockImplementation(
        async (): Promise<DeleteResult> => ({ raw: null, affected: 0 }),
      );

    const findSpy = jest
      .spyOn(eventService, 'findOne')
      .mockImplementation((): any => undefined);

    expect(await eventsController.remove(2, user)).toEqual({
      raw: null,
      affected: 0,
    });

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledTimes(0);
  });
});
