import {
  Controller,
  Delete,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('update/:id')
  async update() {
    return await this.usersService.update();
  }

  @Delete('delete/:id')
  async delete() {
    return await this.usersService.delete();
  }

  @UseGuards(JwtGuard)
  @Get('/search')
  async searchUsers(@Query('searchQuery') searchQuery: string, @Request() req) {
    return await this.usersService.searchUsers(searchQuery, req.user.id);
  }
}
