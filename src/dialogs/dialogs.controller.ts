import {
  Controller,
  Body,
  UseGuards,
  Request,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DiaglogsService } from './dialogs.service';
import { CreateDialogDto } from './dtos/dialog.dtos';

@Controller('dialogs')
export class DialogsController {
  constructor(private readonly dialogsService: DiaglogsService) {}

  @UseGuards(JwtGuard)
  @Get('')
  getAll(@Request() req) {
    return this.dialogsService.getAll(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  create(
    @Body() arg: Pick<CreateDialogDto, 'message' | 'receiverId'>,
    @Request() req,
  ) {
    return this.dialogsService.create({ ...arg, creatorId: req.user.id });
  }

  @UseGuards(JwtGuard)
  @Get('get/:id')
  getById(@Param('id') id: string, @Request() req) {
    return this.dialogsService.getById(+id);
  }
}
