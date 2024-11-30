import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserRole } from '../users.role';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialsDto } from '../dto/credentials.dto';
import { UpdateUserDto } from '../dto/update.users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<UserEntity> {
    const user = await this.createNewUser(createUserDto, role);
    return this.saveUser(user);
  }

  private async createNewUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<UserEntity> {
    const { email, name, password } = createUserDto;

    const user = new UserEntity();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    return user;
  }

  private async saveUser(user: UserEntity): Promise<UserEntity> {
    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async buscarUsuarioPorId(id: string): Promise<UserEntity> {
    const user = this.userRepository.findOne({
      where: { id },
      select: ['email', 'name', 'role', 'id'],
    });

    if (user === null) {
      throw new NotFoundException(id, 'Não existe usuário com esse Id');
    }

    return user;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    id: string,
  ): Promise<UserEntity> {
    const user = await this.buscarUsuarioPorId(id);
    const { name, email, role, status } = updateUserDto;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? user.status : status;
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
        error,
      );
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }

  async checkCredentials(
    credentialsDto: CredentialsDto,
  ): Promise<UserEntity> | null {
    const email = credentialsDto.email;
    const password = credentialsDto.password;

    const user = await this.userRepository.findOne({
      where: { email, status: true },
    });

    if (user && (await user.checkPassword(password))) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.createUser(createUserDto, UserRole.ADMIN);
    }
  }
}
