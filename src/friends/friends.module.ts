import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendRequest } from 'src/typeorm/entities/friendRequest.entity';
import { Friend } from 'src/typeorm/entities/friend.entity';
import { UsersService } from 'src/users/users.service';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([FriendRequest]),
    TypeOrmModule.forFeature([Friend]),
  ],
  providers: [FriendsService, UsersService, MediaService],
  controllers: [FriendsController],
})
export class FriendsModule {}
