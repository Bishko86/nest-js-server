import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { CreateUserDto } from './input/create-user-dto';
import { EventEntity } from 'src/event/entities/event.entity';
import { Exclude, Expose } from 'class-transformer';
import { Attendee } from 'src/event/entities/attendee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => EventEntity, (event) => event.organizer)
  @Expose()
  organized: EventEntity[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  @Expose()
  attennded: Attendee[];

  constructor(user?: Omit<CreateUserDto, 'retypePassword'>) {
    if (user) {
      Object.assign(this, user);
    }
  }
}
