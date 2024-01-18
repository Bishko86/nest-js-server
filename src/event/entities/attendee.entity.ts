import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';

@Entity('attendees', { name: 'attendees' })
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.attendees, {
    nullable: true,
  })
  @JoinColumn()
  event: EventEntity;

  @Column({
    type: 'text',
    default: AttendeeAnswer.Accepted,
  })
  answer: AttendeeAnswer;
}
