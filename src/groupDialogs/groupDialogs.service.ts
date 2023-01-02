import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupDialog } from 'src/typeorm/entities/groupDialog.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateGroupDialogDto } from './dtos/groupDialogs.dtos';

@Injectable()
export class GroupDialogsService {
  constructor(
    @InjectRepository(GroupDialog)
    private readonly groupDialogRepo: Repository<GroupDialog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async create({ title, user, users }: CreateGroupDialogDto & { user: User }) {
    const creator = await this.userRepo.findOne({ where: { id: user.id } });
    if (!creator) throw new UnauthorizedException('Authorization error');

    const promiseOfUsers = users.map((userId) =>
      this.usersService.findById(userId),
    );
    const findedUsers = (await Promise.all(promiseOfUsers)).filter((u) => !!u);
    findedUsers.push(creator);

    const group = await this.groupDialogRepo.create({
      creator,
      creatorId: creator.id,
      users: findedUsers,
      title: title,
    });

    return await this.groupDialogRepo.save(group);
  }

  async delete(groupId: number, userId: number) {
    const group = await this.groupDialogRepo.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Such group dialog not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Authorization error');
    if (group.creatorId !== userId)
      throw new ForbiddenException('You dont have access');

    await this.groupDialogRepo.delete({ id: group.id });
    return group;
  }

  async getAll(user: User) {
    return this.groupDialogRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: user.id })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.lastMessage', 'lastMessage')
      .leftJoinAndSelect('group.messages', 'message')
      .orderBy('lastMessage.createdAt', 'DESC')
      .getMany();
  }
}
