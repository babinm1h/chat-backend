import { Controller, Delete, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('/:id')
  update() {
    return this.usersService.update();
  }

  @Delete('/:id')
  delete() {
    return this.usersService.delete();
  }
}
