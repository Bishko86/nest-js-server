import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJwtGql } from '../guards/auth-guard-jwt.gql';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../input/create-user-dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userServise: UsersService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User, { name: 'userAdd' })
  async create(@Args('input') input: CreateUserDto): Promise<User> {
    return await this.userServise.createUser(input);
  }
}
