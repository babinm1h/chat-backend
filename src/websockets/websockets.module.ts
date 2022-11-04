import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from 'src/messages/messages.service';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GatewaySessions } from './gateway.sessions';
import { MessagesGateway } from './websockets.gateway';

@Module({
  imports: [
    EventEmitterModule.forRoot({}),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Dialog]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    MessagesGateway,
    MessagesService,
    UsersService,
    JwtService,
    GatewaySessions,
  ],
  controllers: [],
})
export class WebsocketsModule {}
