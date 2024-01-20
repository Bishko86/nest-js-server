import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/users.service';
import { Profile } from './profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '600m',
        },
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, UsersService],
  controllers: [AuthController, UsersController],
})
export class AuthModule {}
