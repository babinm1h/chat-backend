import {
  NotFoundException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/typeorm/entities/friend.entity';
import {
  FriendRequest,
  FriendRequestStatus,
} from 'src/typeorm/entities/friendRequest.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend) private readonly friendRepo: Repository<Friend>,
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly FriendReqRepo: Repository<FriendRequest>,
    private usersService: UsersService,
  ) {}

  async getMyFriends(userId: number) {
    return this.friendRepo.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
    });
  }

  async deleteFriend(userId: number, friendId: number) {
    const friend = await this.friendRepo.findOne({
      where: { id: friendId },
      relations: ['receiver', 'sender'],
    });
    if (!friend) throw new NotFoundException();

    if (friend.receiver.id !== userId && friend.sender.id !== userId) {
      throw new ForbiddenException();
    }

    await this.friendRepo.delete({ id: friendId });

    const req = await this.FriendReqRepo.findOne({
      where: [
        { receiver: { id: userId }, sender: { id: friendId } },
        { receiver: { id: friendId }, sender: { id: userId } },
      ],
    });
    if (req) await this.FriendReqRepo.delete({ id: req.id });

    return friend;
  }

  async createReq(userId: number, reqUserId: number) {
    // const exists = await this.FriendReqRepo.findOne({
    //   where: { sender: { id: userId }, receiver: { id: reqUserId } },
    // });
    // if (exists) throw new BadRequestException('You already send request');

    const receiver = await this.UserRepo.findOne({ where: { id: reqUserId } });
    if (!receiver) throw new NotFoundException();

    await this.UserRepo.update(
      { id: receiver.id },
      { friendRequestsCount: receiver.friendRequestsCount + 1 },
    );

    const sender = await this.UserRepo.findOne({ where: { id: userId } });
    if (!sender) throw new NotFoundException();

    const req = this.FriendReqRepo.create({ receiver, sender });
    return await this.FriendReqRepo.save(req);
  }

  async rejectReq(userId: number, reqId: number) {
    const req = await this.FriendReqRepo.findOne({
      where: { id: reqId },
      relations: ['sender', 'receiver'],
    });
    if (!req) throw new NotFoundException();

    req.status = FriendRequestStatus.rejected;
    await this.FriendReqRepo.save(req);

    const user = await this.usersService.findById(userId);
    await this.UserRepo.update(
      { id: userId },
      { friendRequestsCount: user.friendRequestsCount - 1 },
    );

    return req;
  }

  async acceptReq(userId: number, reqId: number) {
    const req = await this.FriendReqRepo.findOne({
      where: { id: reqId },
      relations: ['sender', 'receiver'],
    });
    if (!req) throw new NotFoundException();

    const friend = this.friendRepo.create({
      sender: req.sender,
      receiver: req.receiver,
    });
    await this.friendRepo.save(friend);

    req.status = FriendRequestStatus.accepted;
    await this.FriendReqRepo.save(req);

    const user = await this.usersService.findById(userId);
    await this.UserRepo.update(
      { id: userId },
      { friendRequestsCount: user.friendRequestsCount - 1 },
    );

    return req;
  }

  async getRequests(userId: number) {
    return await this.FriendReqRepo.createQueryBuilder('req')
      .leftJoinAndSelect('req.receiver', 'receiver')
      .where('receiver.id = :userId', {
        userId: userId,
      })
      .leftJoinAndSelect('req.sender', 'sender')
      .getMany();
  }
}
