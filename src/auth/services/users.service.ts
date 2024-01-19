import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from '../input/create-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getUserBaseQuery() {
    return this.userRepository.createQueryBuilder('e');
  }

  checkIfUserExists(userDto: CreateUserDto): SelectQueryBuilder<User> {
    return this.getUserBaseQuery().andWhere(
      'e.email = :email OR e.username = :username',
      { email: userDto.email, username: userDto.username },
    );
  }

  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
