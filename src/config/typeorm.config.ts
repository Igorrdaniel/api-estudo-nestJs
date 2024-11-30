import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'nestjs',
  entities: [UserEntity],
  synchronize: true,
};
