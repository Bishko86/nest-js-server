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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
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

  constructor(userDto?: CreateUserDto) {
    if (userDto) {
      this.username = userDto.username;
      this.email = userDto.email;
      this.firstName = userDto.firstName;
      this.lastName = userDto.lastName;
      this.password = userDto.password;
    }
  }
}
