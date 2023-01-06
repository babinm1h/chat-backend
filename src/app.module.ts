import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { DialogsModule } from './dialogs/dialogs.module';
import { MessagesModule } from './messages/messages.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { GroupDialogsModule } from './groupDialogs/groupDialogs.module';
import { MediaModule } from './media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MessageAttachmentsModule } from './messageAttachments/messageAttachments.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    AuthModule,
    UsersModule,
    DialogsModule,
    MessagesModule,
    WebsocketsModule,
    GroupDialogsModule,
    MediaModule,
    MessageAttachmentsModule,
    FriendsModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
