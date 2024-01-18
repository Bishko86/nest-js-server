import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Repository } from 'typeorm';

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
}
