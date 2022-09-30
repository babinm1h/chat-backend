import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dialog } from 'src/typeorm/entities/dialog.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { DialogsController } from './dialogs.controller';
import { DiaglogsService } from './dialogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dialog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [DiaglogsService],
  controllers: [DialogsController],
})
export class DialogsModule {}
