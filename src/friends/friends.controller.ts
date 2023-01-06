import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SocketEvents } from 'src/websockets/types/websocket.types';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(
    private friendsService: FriendsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async deleteFriend(@Param('id') friendId: string, @Request() req) {
    return await this.friendsService.deleteFriend(req.user.id, +friendId);
  }

  @UseGuards(JwtGuard)
  @Get('/get-my')
  async getMyFriends(@Request() req) {
    return await this.friendsService.getMyFriends(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/create-request/:id')
  async createRequest(@Request() req, @Param('id') reqUserId: string) {
    const newReq = await this.friendsService.createReq(req.user.id, +reqUserId);
    this.eventEmitter.emit(SocketEvents.createFriendReq, newReq);
    return newReq;
  }

  @UseGuards(JwtGuard)
  @Put('/reject/:id')
  async rejectReq(@Param('id') reqId: string, @Request() req) {
    return await this.friendsService.rejectReq(req.user.id, +reqId);
  }

  @UseGuards(JwtGuard)
  @Put('/accept/:id')
  async acceptReq(@Param('id') reqId: string, @Request() req) {
    return await this.friendsService.acceptReq(req.user.id, +reqId);
  }

  @UseGuards(JwtGuard)
  @Get('/get-requests')
  async getRequests(@Request() req) {
    return await this.friendsService.getRequests(req.user.id);
  }
}
