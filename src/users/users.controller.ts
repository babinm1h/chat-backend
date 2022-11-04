import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/:id')
  async update() {
    return await this.usersService.update();
  }

  @Delete('/:id')
  async delete() {
    return await this.usersService.delete();
  }

  @Get('/search')
  async searchUsers(@Query('searchQuery') searchQuery: string) {
    return await this.usersService.searchUsers(searchQuery);
  }
}
