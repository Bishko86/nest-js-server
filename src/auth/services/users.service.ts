import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from '../input/create-user-dto';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const cloneUserDto = { ...createUserDto, password };
    delete cloneUserDto.retypePassword;

    const user = new User(cloneUserDto);
    return this.userRepository.save(user);
  }
}
