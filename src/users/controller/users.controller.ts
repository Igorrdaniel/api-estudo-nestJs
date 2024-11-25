import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import { ReturnUserDto } from '../dto/return.user.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/admin')
  async createAdminUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createNormalUser(createUserDto);
    return {
      user,
      message: 'Usuário cadastrado com sucesso',
    };
  }
}
