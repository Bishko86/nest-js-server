import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly authService: AuthService,
  ) {
    super();
  }
  async validate(username: string, password: string): Promise<User> {
    return await this.authService.validateUser(username, password);
  }
}
