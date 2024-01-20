import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuardLocal } from '../guards/auth-guard-local';
import { AuthGuardJwt } from '../guards/auth-guard-jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
