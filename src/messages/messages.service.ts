import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/messages.dtos';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(Dialog) private readonly dialogsRepo: Repository<Dialog>,
  ) {}

  async create({ dialogId, text }: CreateMessageDto, creator: User) {
    const newMsg = await this.messagesRepo.create({
      creator: instanceToPlain(creator),
      dialogId,
      text,
    });

    const dialog = await this.dialogsRepo.findOne({
      where: { id: dialogId },
    });

    if (!dialog) throw new NotFoundException('Dialog not found');
    if (dialog.creatorId !== creator.id && dialog.receiverId !== creator.id)
      throw new ForbiddenException('You dont have access to this dialog');

    const savedMsg = await this.messagesRepo.save(newMsg);

    dialog.lastMessage = savedMsg;
    await this.dialogsRepo.save(dialog);

    return savedMsg;
  }
}
