import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entity/user';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'nestjs',
  entities: [User],
  synchronize: true,
};
