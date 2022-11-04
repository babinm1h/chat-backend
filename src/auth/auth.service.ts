import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/auth.dtos';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/typeorm/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Пользователь не найден');

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) throw new BadRequestException('Wrong password');
    return user;
  }

  async login(user: User) {
    const candidate = await this.userRepo.findOne({ where: { id: user.id } });
    if (!candidate) throw new NotFoundException('User not found');

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '30d' });
    return { user: candidate, token };
  }

  async register(id: number) {
    return this.jwtService.sign({ id }, { expiresIn: '30d' });
  }
}
