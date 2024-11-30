import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserEntity } from '../../users/entity/user.entity';
import { CreateUserDto } from '../../users/dto/create.user.dto';
import { UserRole } from '../../users/users.role';
import { UsersService } from '../../users/service/users.service';
import { CredentialsDto } from '../../users/dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userService.createUser(createUserDto, UserRole.USER);
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userService.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
