import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dtos/messages.dtos';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body() dto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(dto, req.user);
  }
}
