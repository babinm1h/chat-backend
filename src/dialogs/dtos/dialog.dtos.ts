import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDialogDto {
  @IsNumber()
  @IsNotEmpty()
  creatorId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
