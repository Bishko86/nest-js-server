import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJwtGql } from '../guards/auth-guard-jwt.gql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
