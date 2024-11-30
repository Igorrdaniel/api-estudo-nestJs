import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../../users/service/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'super-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
