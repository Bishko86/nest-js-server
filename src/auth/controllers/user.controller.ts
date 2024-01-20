import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../input/create-user-dto';
import { User } from '../user.entity';
import { UsersService } from '../services/users.service';
import { CreateUserResponse } from '../models/create-user-response.model';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
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

    const cloneUserDto = Object.assign({}, createUserDto);
    delete cloneUserDto.retypePassword;

    const user = new User(cloneUserDto);
    const token = this.authService.getTokenForUser(user);

    return new CreateUserResponse(cloneUserDto, token);
  }
}
