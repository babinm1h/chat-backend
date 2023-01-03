import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dtos/users.dtos';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Put('/update')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Request() req,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.update(+req.user.id, {
      ...dto,
      avatar: file,
    });
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete() {
    return await this.usersService.delete();
  }

  @UseGuards(JwtGuard)
  @Get('/search')
  async searchUsers(@Query('searchQuery') searchQuery: string, @Request() req) {
    return await this.usersService.searchUsers(searchQuery, req.user.id);
  }
}
