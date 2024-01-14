import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async findAllEvents(): Promise<EventEntity[]> {
    return this.eventRepository.find();
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
    return this.eventRepository.findOne({ where: { id: id } });
  }

  async createEvent(event: CreateEventDto): Promise<EventEntity> {
    const eventDto = this.eventRepository.create(event);
    return await this.eventRepository.save(eventDto);
  }

  async updateEvent(
    id: number,
    updateMenuDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const menu = await this.findEvent(id);
    Object.assign(menu, updateMenuDto);
    return await this.eventRepository.save(menu);
  }

  async removeEvent(id: number): Promise<{ message: string }> {
    const result = await this.eventRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`A menu "${id}" was not found`);
    }

    return { message: 'Event successfully deleted' };
  }
}
