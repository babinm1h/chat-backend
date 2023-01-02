import { ArrayMinSize, ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class CreateGroupDialogDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'You should add at least 1 user' })
  @ArrayMaxSize(25, { message: 'You cant add more than 25 users' })
  users: number[];
}
