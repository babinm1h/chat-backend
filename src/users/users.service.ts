import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../auth/dtos/auth.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const isExist = await this.UserRepo.findOne({
      where: { email: dto.email },
    });

    if (isExist)
      throw new BadRequestException('User with this email already exist');

    const hashedPass = await bcrypt.hash(dto.password, 7);
    const newUser = await this.UserRepo.create({
      ...dto,
      password: hashedPass,
    });

    const user = await this.UserRepo.save(newUser);

    return user;
  }

  async update() {}

  async delete() {}

  async findById(id: number) {
    const user = await this.UserRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.UserRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
