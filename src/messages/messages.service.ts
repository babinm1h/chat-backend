import {
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
    const dialog = await this.dialogsRepo.findOne({
      where: { id: dialogId },
    });

    if (!dialog) throw new NotFoundException('Dialog not found');
    if (dialog.creatorId !== creator.id && dialog.receiverId !== creator.id)
      throw new ForbiddenException('You dont have access to this dialog');

    const newMsg = await this.messagesRepo.create({
      creator: instanceToPlain(creator),
      dialogId,
      text,
      dialog,
    });

    const savedMsg = await this.messagesRepo.save(newMsg);

    dialog.lastMessage = savedMsg;
    await this.dialogsRepo.save(dialog);

    return {
      ...savedMsg,
      receiverId:
        dialog.creatorId !== creator.id ? dialog.creatorId : dialog.receiverId,
    };
  }

  async delete(user: User, messageId: number) {
    const msg = await this.messagesRepo.findOne({ where: { id: messageId } });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.creatorId !== user.id)
      throw new ForbiddenException("You cant delete someone else's message");

    const dialog = await this.dialogsRepo.findOne({
      where: { id: msg.dialogId },
      relations: ['messages', 'lastMessage'],
    });

    if (dialog.lastMessage?.id === messageId) {
      await this.deleteLastMessage(dialog);
    }

    await this.messagesRepo.delete({ id: messageId });
    return {
      ...msg,
      receiverId:
        user.id === dialog.receiverId ? dialog.creatorId : dialog.receiverId,
    };
  }

  async deleteLastMessage(dialog: Dialog) {
    const length = dialog.messages.length;
    if (length <= 1) {
      await this.dialogsRepo.update({ id: dialog.id }, { lastMessage: null });
    } else {
      const newLast = dialog.messages[length - 2];
      await this.dialogsRepo.update(
        { id: dialog.id },
        { lastMessage: newLast },
      );
    }
  }

  async update(user: User, messageId: number, text: string) {
    const msg = await this.messagesRepo.findOne({ where: { id: messageId } });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.creatorId !== user.id)
      throw new ForbiddenException("You cant edit someone else's message");

    const dialog = await this.dialogsRepo.findOne({
      where: { id: msg.dialogId },
      relations: ['messages', 'lastMessage'],
    });

    if (dialog.lastMessage?.id === messageId) {
      await this.dialogsRepo.update(
        { id: dialog.id },
        { lastMessage: { ...dialog.lastMessage, text } },
      );
    }

    msg.text = text;
    await this.messagesRepo.save(msg);
    return {
      ...msg,
      receiverId:
        user.id === dialog.receiverId ? dialog.creatorId : dialog.receiverId,
    };
  }
}
