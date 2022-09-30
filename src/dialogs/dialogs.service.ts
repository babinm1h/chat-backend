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
    return (
      this.dialogRepo
        .createQueryBuilder('dialog')
        .limit(30)
        // Первый аргумент - это отношение, которое вы хотите загрузить, а второй аргумент - это псевдоним, который вы присваиваете таблице этого отношения
        .leftJoinAndSelect('dialog.creator', 'creator')
        .leftJoinAndSelect('dialog.receiver', 'receiver')
        .where('receiver.id = :id', { id: userId })
        .orWhere('creator.id = :id', { id: userId })
        // creatorUser = dialog.creator
        .leftJoin('dialog.creator', 'creatorUser')
        .leftJoin('dialog.receiver', 'receiverUser')
        .addSelect([
          'creatorUser.id',
          'creatorUser.firstName',
          'creatorUser.lastName',
          'creatorUser.email',
        ])
        .addSelect([
          'receiverUser.id',
          'receiverUser.firstName',
          'receiverUser.lastName',
          'receiverUser.email',
        ])
        .getMany()
    );
  }

  async isCreated(receiverId: number, creatorId: number) {
    return await this.dialogRepo.findOne({
      where: [
        { receiverId, creatorId },
        { creatorId: receiverId, receiverId: creatorId },
      ],
    });
  }

  async create(dto: CreateDialogDto) {
    if (await this.isCreated(dto.receiverId, dto.creatorId)) {
      return 'Dialog already exist';
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

    return await this.dialogRepo.save(dialog);
  }

  async getById(id: number) {
    const dialog = await this.dialogRepo.findOne({
      where: { id },
      relations: ['creator', 'receiver'],
    });
    if (!dialog) throw new NotFoundException('Dialog not found');

    return dialog;
  }
}
