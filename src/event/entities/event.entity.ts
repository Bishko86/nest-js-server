import { ContentDB } from 'src/shared/shared-entities';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';
import { User } from 'src/auth/user.entity';

@Entity('event', { name: 'event' })
export class EventEntity extends ContentDB {
  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'when', type: 'date', nullable: true })
  when: Date;

  @OneToMany(() => Attendee, (attendees) => attendees.event)
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;
  attendeeDeclined?: AttendeeAnswer;
  attendeePending?: AttendeeAnswer;
  attendeeAccepted?: AttendeeAnswer;
}
