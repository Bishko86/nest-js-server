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

@Entity('attendees', { name: 'attendees' })
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.attendees, {
    nullable: true,
  })
  @JoinColumn()
  @Expose()
  event: EventEntity;

  @Column({
    type: 'text',
    default: AttendeeAnswer.Accepted,
  })
  @Expose()
  answer: AttendeeAnswer;
}
