import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../users/entity/user.entity';

export const GetUser = createParamDecorator((data, req): UserEntity => {
  const user = req.args[0].user;
  return user;
});
