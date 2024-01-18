import { ContentDB } from 'src/shared/shared-entities';
import { Entity, Column, OneToMany } from 'typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';

@Entity('event', { name: 'event' })
export class EventEntity extends ContentDB {
  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'when', type: 'date', nullable: true })
  when: Date;

  @OneToMany(() => Attendee, (attendees) => attendees.event)
  attendees: Attendee[];

  attendeeCount?: number;
  attendeeDeclined?: AttendeeAnswer;
  attendeePending?: AttendeeAnswer;
  attendeeAccepted?: AttendeeAnswer;
}
