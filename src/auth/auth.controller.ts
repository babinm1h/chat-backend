import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/auth/dtos/auth.dtos';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { instanceToPlain } from 'class-transformer';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    const user = instanceToPlain(await this.usersService.create(dto));
    const token = await this.authService.register(user.id);
    return { user, token };
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtGuard)
  @Get('/check')
  checkAuth(@Request() req) {
    return req.user;
  }
}
