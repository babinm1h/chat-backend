import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { GatewaySessions } from './gateway.sessions';
import { IAuthSocket, SocketEvents } from './types/websocket.types';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  },
  pingInterval: 10000,
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
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: IAuthSocket) {
    const { id } = this.jwtService.decode(socket.chatToken) as { id: number };
    this.wsSessions.setUserSocket(id, socket);

    console.log(this.wsSessions.getSessions().keys());
  }

  handleDisconnect(socket: Socket) {
    console.log(socket.id + ' disconnect');
  }

  // @SubscribeMessage('createMessage')
  // handleCreateMessage(@MessageBody() data: any) {
  //   console.log(data, 'create777');
  // }

  @OnEvent(SocketEvents.createMsg)
  handleMessageCreate(payload: Message & { receiverId: number }) {
    const receiverSocket = this.wsSessions.getUserSocket(payload.receiverId);
    const creatorSocket = this.wsSessions.getUserSocket(payload.creatorId);
    creatorSocket?.emit(SocketEvents.receiveMsg, payload);
    receiverSocket?.emit(SocketEvents.receiveMsg, payload);
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
}