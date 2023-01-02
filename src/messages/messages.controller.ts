import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Delete,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SocketEvents } from 'src/websockets/types/websocket.types';
import { CreateMessageBodyDto } from './dtos/messages.dtos';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtGuard)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async create(
    @Body() dto: CreateMessageBodyDto,
    @Request() req,
    @UploadedFiles() files?: { files?: Express.Multer.File[] },
  ) {
    const msg = await this.messagesService.create({
      ...dto,
      creator: req.user,
      files: files?.files,
    });
    this.eventEmitter.emit(SocketEvents.createMsg, msg);
    return msg;
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async delete(@Request() req, @Param('id') messageId: number) {
    const msg = await this.messagesService.delete(req.user, +messageId);
    this.eventEmitter.emit(SocketEvents.deleteMsg, msg);
    return msg;
  }

  @UseGuards(JwtGuard)
  @Put('update/:id')
  async update(
    @Request() req,
    @Param('id') messageId: number,
    @Body('text') text: string,
  ) {
    const msg = await this.messagesService.update(req.user, +messageId, text);
    this.eventEmitter.emit(SocketEvents.updateMsg, msg);
    return msg;
  }

  @UseGuards(JwtGuard)
  @Put('read/:id')
  async readMessage(@Request() req, @Param('id') messageId: number) {
    const msg = await this.messagesService.readMessage(req.user, +messageId);
    this.eventEmitter.emit(SocketEvents.readMsg, msg);
    return msg;
  }
}
