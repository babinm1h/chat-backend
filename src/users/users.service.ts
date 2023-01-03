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
import { UpdateUserDto } from './dtos/users.dtos';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    private mediaService: MediaService,
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
      groupDialogs: [],
    });

    const user = await this.UserRepo.save(newUser);
    return user;
  }

  async update(userId: number, { avatar, ...dto }: UpdateUserDto) {
    const user = await this.UserRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');

    if (avatar) {
      const avaUrl = await this.mediaService.image(avatar);
      return await this.UserRepo.save({ ...user, ...dto, avatar: avaUrl });
    }

    return await this.UserRepo.save({ ...user, ...dto });
  }

  async delete() {
    return;
  }

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

  async searchUsers(searchQuery: string, authId: number) {
    const found = await this.UserRepo.createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${searchQuery}%`,
      })
      .orWhere('LOWER(user.lastName) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${searchQuery}%`,
      })
      .select(['user.firstName', 'user.email', 'user.lastName', 'user.id'])
      .getMany();

    return found.filter((user) => user.id !== authId);
  }
}
