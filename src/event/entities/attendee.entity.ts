import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';
import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { CreateAttendeeDto } from '../input/create-attendee.dto';

@Entity('attendees', { name: 'attendees' })
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: true })
  @Expose()
  name: string;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.attendees, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  event: EventEntity;

  @Column()
  eventId: number;

  @Column({
    type: 'text',
    default: AttendeeAnswer.Accepted,
    nullable: true,
  })
  @Expose()
  answer: AttendeeAnswer;

  @ManyToOne(() => User, (user) => user.attennded)
  user: User;

  @Expose()
  userId: number;

  constructor(eventId?: number, input?: CreateAttendeeDto) {
    if (eventId && input) {
      this.eventId = eventId;
      this.userId = input.user.id;
      this.name = input.name;
      this.event = input.event;
      this.answer = input.answer;
      this.user = input.user;
    }
  }
}
