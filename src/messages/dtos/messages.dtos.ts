import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsNotEmpty()
  dialogId: number;
}
