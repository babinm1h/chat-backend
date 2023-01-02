import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaService } from 'src/media/media.service';
import {
  FileTypes,
  MessageAttachment,
} from 'src/typeorm/entities/messageAttachments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly messagesAttachmentRepo: Repository<MessageAttachment>,
    private mediaService: MediaService,
  ) {}

  async create(f: Express.Multer.File) {
    if (f.mimetype.includes('image')) {
      return this.messagesAttachmentRepo.save(
        this.messagesAttachmentRepo.create({
          type: FileTypes.image,
          path: await this.mediaService.image(f),
        }),
      );
    } else if (f.mimetype.includes('video')) {
      return this.messagesAttachmentRepo.save(
        this.messagesAttachmentRepo.create({
          type: FileTypes.video,
          path: await this.mediaService.video(f),
        }),
      );
    } else if (f.mimetype.includes('audio')) {
      return this.messagesAttachmentRepo.save(
        this.messagesAttachmentRepo.create({
          type: FileTypes.audio,
          path: await this.mediaService.audio(f),
        }),
      );
    } else {
      return this.messagesAttachmentRepo.save(
        this.messagesAttachmentRepo.create({
          type: FileTypes.file,
          path: await this.mediaService.file(f),
        }),
      );
    }
  }
}
