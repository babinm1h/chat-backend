import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from 'src/media/media.service';
import { MessageAttachmentsService } from 'src/messageAttachments/messageAttachments.service';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { MessageAttachment } from 'src/typeorm/entities/messageAttachments.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Dialog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([MessageAttachment]),
  ],
  providers: [MessagesService, MediaService, MessageAttachmentsService],
})
export class MessagesModule {}
