import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../users/entity/user.entity';

export const GetUser = createParamDecorator((data, req): UserEntity => {
  return req.args[0].user;
});
