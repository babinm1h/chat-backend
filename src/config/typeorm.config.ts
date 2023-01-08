import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { FriendRequest } from 'src/typeorm/entities/friendRequest.entity';
import { GroupDialog } from 'src/typeorm/entities/groupDialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { MessageAttachment } from 'src/typeorm/entities/messageAttachments.entity';
import { User } from 'src/typeorm/entities/user.entity';

export const getTypeOrmConfig = async (
  cfg: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  let dbCfg: TypeOrmModuleOptions;

  if (process.env.NODE_ENV === 'prod') {
    dbCfg = {
      type: 'postgres',
      host: 'dpg-cetd0t1gp3jmgl0ho4cg-a',
      url: 'postgres://user:cxzfEdOnOhO8KWnnMWaqLqBoG9noDJIQ@dpg-cetd0t1gp3jmgl0ho4cg-a.frankfurt-postgres.render.com/chat_mcxl',
      autoLoadEntities: true,
      synchronize: true,
      port: cfg.get('DB_PORT'),
      password: `cxzfEdOnOhO8KWnnMWaqLqBoG9noDJIQ`,
      username: 'user',
      database: 'chat_mcxl',
      ssl: true,
      entities: [
        User,
        Dialog,
        Message,
        GroupDialog,
        MessageAttachment,
        FriendRequest,
      ],
    };
  } else {
    dbCfg = {
      type: 'postgres',
      host: 'localhost',
      autoLoadEntities: true,
      synchronize: true,
      port: cfg.get('DB_PORT'),
      password: cfg.get('DB_PASSWORD'),
      username: cfg.get('DB_USERNAME'),
      database: cfg.get('DB_NAME'),
      entities: [
        User,
        Dialog,
        Message,
        GroupDialog,
        MessageAttachment,
        FriendRequest,
      ],
    };
  }

  return dbCfg;
};
