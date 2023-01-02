import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from 'src/media/media.service';
import { Message } from 'src/typeorm/entities/message.entity';
import { MessageAttachment } from 'src/typeorm/entities/messageAttachments.entity';
import { MessageAttachmentsService } from './messageAttachments.service';

@Module({
  controllers: [],
  providers: [MessageAttachmentsService, MediaService],
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([MessageAttachment]),
  ],
})
export class MessageAttachmentsModule {}
