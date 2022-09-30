import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Dialog]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [MessagesService],
})
export class MessagesModule {}
