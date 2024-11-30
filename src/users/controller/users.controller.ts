import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import { ReturnUserDto } from '../dto/return.user.dto';
import { UsersService } from '../service/users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../auth/role.decorator';
import { UserRole } from '../users.role';
import { UpdateUserDto } from '../dto/update.users';
import { GetUser } from '../../auth/get-user.decorator';
import { UserEntity } from '../entity/user.entity';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async buscarUsuarioPorId(@Param('id') id: string): Promise<ReturnUserDto> {
    const user = await this.userService.buscarUsuarioPorId(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  async atualizarUsuario(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() userEntity: UserEntity,
    @Param('id') id: string,
  ) {
    if (userEntity.role != UserRole.ADMIN && userEntity.id != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.userService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
