import { ContentDB } from 'src/shared/shared-entities';
import { Entity, Column } from 'typeorm';

@Entity('event', { name: 'event' })
export class EventEntity extends ContentDB {
  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'when', type: 'date', nullable: true })
  when: Date;
}
