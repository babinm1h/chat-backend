import {
  Controller,
  Body,
  UseGuards,
  Request,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SocketEvents } from 'src/websockets/types/websocket.types';
import { DiaglogsService } from './dialogs.service';

@Controller('dialogs')
export class DialogsController {
  constructor(
    private readonly dialogsService: DiaglogsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtGuard)
  @Get('')
  async getAll(@Request() req) {
    return await this.dialogsService.getAll(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body('receiverId') receiverId: number, @Request() req) {
    const dialog = await this.dialogsService.create({
      receiverId,
      creatorId: req.user.id,
    });

    if (dialog.status === 'created') {
      this.eventEmitter.emit(SocketEvents.createDialog, {
        dialog: dialog.dialog,
      });
    }

    return dialog;
  }

  @UseGuards(JwtGuard)
  @Get('get/:id')
  async getById(@Param('id') id: string, @Request() req) {
    return await this.dialogsService.getById(+id);
  }
}
