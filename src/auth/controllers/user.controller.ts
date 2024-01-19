import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../input/create-user-dto';
import { User } from '../user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.retypePassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }

    const isUserExists = await this.usersService
      .checkIfUserExists(createUserDto)
      .getOne();

    this.logger.debug(isUserExists);

    if (isUserExists) {
      throw new BadRequestException([
        'User with such email or username already exists',
      ]);
    }

    const password = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user = new User({ ...createUserDto, password });

    const response = {
      ...(await this.usersService.saveUser(user)),
      token: this.authService.getTokenForUser(user),
    };

    delete response.password;
    return response;
  }
}
