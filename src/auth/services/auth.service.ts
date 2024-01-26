import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.debug(`User ${username} not found`);
      throw new UnauthorizedException();
    }
    const test = await bcrypt.compare(password, 'user.password');
    this.logger.debug(`1: ${password}, 2: ${user.password}, ${test}`);

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credential for ${username}`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
