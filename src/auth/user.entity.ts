import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { CreateUserDto } from './input/create-user-dto';

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
