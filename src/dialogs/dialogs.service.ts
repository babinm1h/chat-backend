import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDialogDto } from './dtos/dialog.dtos';

@Injectable()
export class DiaglogsService {
  constructor(
    @InjectRepository(Dialog) private readonly dialogRepo: Repository<Dialog>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
  ) {}

  async getAll(userId: number) {
    const dialogs = await this.dialogRepo.find({
      where: [{ creatorId: userId }, { receiverId: userId }],
      relations: [
        'creator',
        'receiver',
        'messages',
        'messages.replyToMsg',
        'messages.creator',
        'lastMessage',
      ],
      order: {
        lastMessage: {
          createdAt: 'DESC',
        },
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    // const unreadedCount = dialogs
    //   .map((d) =>
    //     d.messages.filter((msg) => !msg?.readed && msg?.creatorId !== userId),
    //   )
    //   .flat(1).length;

    return dialogs;
  }

  async isCreated(receiverId: number, creatorId: number) {
    const dialog = await this.dialogRepo.findOne({
      where: [
        { receiverId, creatorId },
        { creatorId: receiverId, receiverId: creatorId },
      ],
      relations: ['receiver', 'creator'],
    });

    return { status: 'exist', dialog };
  }

  async create(dto: CreateDialogDto) {
    const alreadyCreated = await this.isCreated(dto.receiverId, dto.creatorId);
    if (alreadyCreated.dialog) {
      return alreadyCreated;
    }

    const receiver = await this.usersRepo.findOne({
      where: { id: dto.receiverId },
    });

    if (!receiver)
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);

    const creator = await this.usersRepo.findOne({
      where: { id: dto.creatorId },
    });

    if (!creator)
      throw new HttpException('Creator not found', HttpStatus.NOT_FOUND);

    const dialog = await this.dialogRepo.create({
      creatorId: dto.creatorId,
      receiverId: dto.receiverId,
      creator,
      receiver,
      lastMessage: null,
      messages: [],
    });

    if (!dialog)
      throw new HttpException(
        'Error while creating dialog',
        HttpStatus.BAD_REQUEST,
      );

    return { dialog: await this.dialogRepo.save(dialog), status: 'created' };
  }

  async getById(id: number) {
    const dialog = await this.dialogRepo.findOne({
      where: { id },
      relations: [
        'creator',
        'receiver',
        'messages',
        'messages.replyToMsg',
        'messages.creator',
        'messages.attachments',
      ],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!dialog) throw new NotFoundException('Dialog not found');
    return dialog;
  }
}
