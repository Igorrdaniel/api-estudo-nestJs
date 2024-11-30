import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/module/users.module';
import { UsersController } from './users/controller/users.controller';
import { AuthModule } from './auth/module/auth.module';
import { AuthService } from './auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, AuthModule],
  controllers: [UsersController],
  providers: [AuthService, JwtService],
})
export class AppModule {}
