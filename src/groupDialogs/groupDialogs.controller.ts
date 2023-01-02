import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateGroupDialogDto } from './dtos/groupDialogs.dtos';
import { GroupDialogsService } from './groupDialogs.service';

@Controller('group-dialogs')
export class GroupDialogsController {
  constructor(private readonly groupDialogsService: GroupDialogsService) {}

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(@Body() dto: CreateGroupDialogDto, @Request() req) {
    return this.groupDialogsService.create({ ...dto, user: req.user });
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete(@Request() req, @Param('id') groupId: string) {
    return this.groupDialogsService.delete(+groupId, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('')
  async getAll(@Request()req){
    return this.groupDialogsService.getAll(req.user)
  }
}
