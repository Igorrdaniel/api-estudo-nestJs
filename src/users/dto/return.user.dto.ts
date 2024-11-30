import { UserEntity } from '../entity/user.entity';

export class ReturnUserDto {
  user: UserEntity;
  message: string;
}
