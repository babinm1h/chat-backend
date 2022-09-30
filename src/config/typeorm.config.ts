import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';

export const getTypeOrmConfig = async (
  cfg: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: 'localhost',
  autoLoadEntities: true,
  synchronize: true,
  port: cfg.get('DB_PORT'),
  password: cfg.get('DB_PASSWORD'),
  username: cfg.get('DB_USERNAME'),
  database: cfg.get('DB_NAME'),
  entities: [User, Dialog, Message],
});
