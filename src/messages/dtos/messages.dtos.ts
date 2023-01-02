import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/typeorm/entities/user.entity';

export class CreateMessageBodyDto {
  @IsString()
  text: string;

  @IsNotEmpty()
  dialogId: number;

  replyToMsgId?: number;
}

export class CreateMessageDto extends CreateMessageBodyDto {
  files?: Express.Multer.File[];
  creator: User;
}
