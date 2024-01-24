import { Repository } from 'typeorm';
import { EventService } from './event.service';
import { EventEntity } from '../entities/event.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { AttendeeService } from './attendee.service';
import { NotFoundException } from '@nestjs/common';
import * as pagiator from '../../pagination/paginator';

jest.mock('../../pagination/paginator');

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<EventEntity>;
  let selectQb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = pagiator.paginate as jest.Mock;

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: AttendeeService,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(EventEntity),
          useValue: {
            save: jest.fn().mockReturnValue(selectQb),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn().mockReturnValue(selectQb),
            where: jest.fn().mockReturnValue(selectQb),
            execute: jest.fn().mockReturnValue(selectQb),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const findEventSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(new EventEntity({ id: 1 }));

      const repoSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({ id: 1 } as EventEntity);

      await expect(
        service.updateEvent(
          1,
          { name: 'New Name', description: 'new description' },
          new User(),
        ),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toHaveBeenCalledWith({
        id: 1,
        name: 'New Name',
        description: 'new description',
      });

      expect(findEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateEvent', () => {
    it('should throw an exeption', async () => {
      const findEventSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(null);

      try {
        await service.updateEvent(1, { name: 'New Name' }, new User());
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(findEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        eventRepository,
        'createQueryBuilder',
      );

      const findEventSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(new EventEntity({ id: 1 }));

      const deleteSpy = jest
        .spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb);

      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      await expect(service.removeEvent(1, new User())).resolves.toBe(undefined);

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');

      expect(deleteSpy).toHaveBeenCalledTimes(1);

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });

      expect(executeSpy).toHaveBeenCalledTimes(1);

      expect(findEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteEvent', () => {
    it('should throw an NotFoundException', async () => {
      const findEventSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(null);

      try {
        expect(await service.removeEvent(1, new User()));
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(findEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const orderBySpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);

      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);

      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);

      mockedPaginate.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });

      expect(
        service.getEventsAttendedByUserIdPaginated(500, {
          limit: 1,
          currentPage: 1,
        }),
      ).resolves.toEqual({
        data: [],
        first: 1,
        last: 1,
        limit: 10,
        total: 10,
      });

      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');

      expect(leftJoinSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinSpy).toHaveBeenCalledWith('e.attendees', 'a');

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId: 500,
      });

      expect(mockedPaginate).toHaveBeenCalledTimes(1);
      expect(mockedPaginate).toHaveBeenCalledWith(selectQb, {
        currentPage: 1,
        limit: 1,
      });
    });
  });
});
