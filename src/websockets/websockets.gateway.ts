import { BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiaglogsService } from 'src/dialogs/dialogs.service';
import { MessagesService } from 'src/messages/messages.service';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { FriendRequest } from 'src/typeorm/entities/friendRequest.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { GatewaySessions } from './gateway.sessions';
import { IAuthSocket, SocketEvents } from './types/websocket.types';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://splendorous-chimera-c8edc6.netlify.app',
    ],
    credentials: true,
  },
  pingInterval: 15000,
  pingTimeout: 15000,
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly wsSessions: GatewaySessions,
    private readonly dialogsService: DiaglogsService,
  ) {}

  @WebSocketServer()
  server: Server;

  decodeJwt(jwt: string) {
    return this.jwtService.decode(jwt) as { id: number };
  }

  handleConnection(socket: IAuthSocket) {
    const { id } = this.decodeJwt(socket.chatToken);
    this.wsSessions.setUserSocket(id, socket);
    console.log(this.wsSessions.getSessions().keys());
  }

  handleDisconnect(socket: Socket) {
    console.log(socket.id + ' disconnect');
  }

  @OnEvent(SocketEvents.createMsg)
  handleMessageCreate(payload: Message & { receiverId: number }) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiverId);
    // const creatorSocket = this.wsSessions.getUserSocket(payload.creatorId);
    // creatorSocket?.emit(SocketEvents.receiveMsg, payload);
    receiverSocket?.emit(SocketEvents.receiveMsg, payload);
  }

  @OnEvent(SocketEvents.createFriendReq)
  handleFriendReqCreate(payload: FriendRequest) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiver.id);
    // const creatorSocket = this.wsSessions.getUserSocket(payload.sender.id);
    // creatorSocket?.emit(SocketEvents.receiveFriendReq, payload);
    receiverSocket?.emit(SocketEvents.receiveFriendReq, payload);
  }

  @OnEvent(SocketEvents.deleteMsg)
  handleMessageDelete(payload: Message & { receiverId: number }) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiverId);
    const creatorSocket = this.wsSessions.getUserSocket(payload.creatorId);
    creatorSocket?.emit(SocketEvents.deleteMsg, payload);
    receiverSocket?.emit(SocketEvents.deleteMsg, payload);
  }

  @OnEvent(SocketEvents.updateMsg)
  handleMessageUpdate(payload: Message & { receiverId: number }) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiverId);
    const creatorSocket = this.wsSessions.getUserSocket(payload.creatorId);
    creatorSocket?.emit(SocketEvents.updateMsg, payload);
    receiverSocket?.emit(SocketEvents.updateMsg, payload);
  }

  @OnEvent(SocketEvents.readMsg)
  handleMessageRead(
    payload: Pick<Message, 'creatorId' | 'id'> & { receiverId: number },
  ) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiverId);
    receiverSocket?.emit(SocketEvents.readMsg, payload);
  }

  @SubscribeMessage(SocketEvents.userStartTyping)
  handleUserStartTyping(
    socket: IAuthSocket,
    payload: { dialogId: string; userName: string },
  ) {
    socket
      .to(`dialog-${payload.dialogId}`)
      .emit(SocketEvents.userStartTyping, payload);
  }

  @SubscribeMessage(SocketEvents.userStopTyping)
  handleUserStopTyping(socket, payload) {
    socket
      .to(`dialog-${payload.dialogId}`)
      .emit(SocketEvents.userStartTyping, payload);
  }

  @SubscribeMessage(SocketEvents.joinRoom)
  handleJoinDialog(socket: IAuthSocket, payload: { dialogId: string }) {
    socket.join(`dialog-${payload.dialogId}`);
    console.log('joined to ' + payload.dialogId);
  }

  @SubscribeMessage(SocketEvents.leaveRoom)
  handleLeaveDialog(socket: IAuthSocket, payload: { dialogId: string }) {
    socket.leave(`dialog-${payload.dialogId}`);
    console.log('leaved from ' + payload.dialogId);
  }

  @OnEvent(SocketEvents.createDialog)
  handleCreateDialog(payload: { dialog: Dialog }) {
    const receiverSocket = this.wsSessions.getUserSocket(
      payload.dialog.receiverId,
    );

    if (receiverSocket) {
      receiverSocket.emit(SocketEvents.createDialog, {
        dialog: payload.dialog,
      });
    }
  }

  @SubscribeMessage(SocketEvents.onVideoCallInit)
  async handleOnVideoCall(
    socket: IAuthSocket,
    { receiverId }: { receiverId: number },
  ) {
    const { id } = this.decodeJwt(socket.chatToken);
    const caller = await this.userService.findById(id, [
      'id',
      'firstName',
      'lastName',
      'avatar',
    ]);

    if (caller.id === +receiverId) {
      throw new BadRequestException('You cant call yourself!');
    }
    const receiverSocket = this.wsSessions.getUserSocket(receiverId);
    receiverSocket?.emit(SocketEvents.onVideoCallInit, { caller });
  }

  @SubscribeMessage(SocketEvents.videoCallAccept)
  async handleVideoCallAccept(
    socket: IAuthSocket,
    { callerId }: { callerId: number; dialogId: number },
  ) {
    const { id } = this.decodeJwt(socket.chatToken);
    const caller = await this.userService.findById(callerId, [
      'id',
      'firstName',
      'lastName',
      'avatar',
    ]);

    const receiverSocket = this.wsSessions.getUserSocket(id);
    const callerSocket = this.wsSessions.getUserSocket(callerId);
    const dialog = await this.dialogsService.isCreated(id, callerId);

    receiverSocket?.emit(SocketEvents.videoCallAccept, {
      callerId: caller.id,
      receiverId: id,
      dialogId: dialog?.dialog?.id,
    });

    callerSocket?.emit(SocketEvents.videoCallAccept, {
      callerId: caller.id,
      receiverId: id,
      dialogId: dialog?.dialog?.id,
    });
  }

  @SubscribeMessage(SocketEvents.videoCallReject)
  async handleVideoCallReject(
    socket: IAuthSocket,
    { callerId }: { callerId: number },
  ) {
    const { id } = this.decodeJwt(socket.chatToken);
    const caller = await this.userService.findById(callerId, [
      'id',
      'firstName',
      'lastName',
      'avatar',
    ]);

    const receiverSocket = this.wsSessions.getUserSocket(id);
    const callerSocket = this.wsSessions.getUserSocket(callerId);

    receiverSocket?.emit(SocketEvents.videoCallReject, {
      caller,
      receiverId: id,
    });

    callerSocket?.emit(SocketEvents.videoCallReject, {
      caller,
      receiverId: id,
    });
  }

  @SubscribeMessage(SocketEvents.videoCallHangup)
  async handleVideoCallHangup(
    socket: IAuthSocket,
    { callerId, receiverId }: { callerId: number; receiverId: number },
  ) {
    // const caller = await this.userService.findById(callerId);
    const receiverSocket = this.wsSessions.getUserSocket(receiverId);
    const callerSocket = this.wsSessions.getUserSocket(callerId);
    receiverSocket?.emit(SocketEvents.videoCallHangup);
    callerSocket?.emit(SocketEvents.videoCallHangup);
  }
}
