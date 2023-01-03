import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from 'src/media/media.service';
import { GroupDialog } from 'src/typeorm/entities/groupDialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GroupDialogsController } from './groupDialogs.controller';
import { GroupDialogsService } from './groupDialogs.service';

@Module({
  controllers: [GroupDialogsController],
  providers: [GroupDialogsService, UsersService, MediaService],
  imports: [
    TypeOrmModule.forFeature([GroupDialog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
  ],
})
export class GroupDialogsModule {}
