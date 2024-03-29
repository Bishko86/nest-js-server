import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../entities/attendee.entity';
import { Repository } from 'typeorm';
import { CreateAttendeeDto } from '../input/create-attendee.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) {}

  async addAttendee(attendee: Attendee): Promise<Attendee> {
    return this.attendeeRepository.save(attendee);
  }

  async getAttendee(): Promise<Attendee[]> {
    return this.attendeeRepository.find();
  }

  async findByEventId(id: number): Promise<Attendee[]> {
    return await this.attendeeRepository.find({
      where: { event: { id } },
    });
  }

  async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });
  }

  async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    user: User,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, user.id)) ??
      new Attendee(eventId, {
        ...input,
        name: user.username,
        user: user,
      });

    return this.attendeeRepository.save(attendee);
  }
}
