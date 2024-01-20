import { Expose } from 'class-transformer';
import { User } from '../user.entity';
import { CreateUserDto } from '../input/create-user-dto';

export class CreateUserResponse extends User {
  @Expose()
  token: string;

  constructor(user: CreateUserDto, token: string) {
    super(user);
    this.token = token;
  }
}
