import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDialogDto {
  @IsNumber()
  @IsNotEmpty()
  creatorId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
