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
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => EventEntity, (event) => event.organizer)
  organized: EventEntity[];

  constructor(user: Omit<CreateUserDto, 'retypePassword'>) {
    Object.assign(this, user);
  }
}
