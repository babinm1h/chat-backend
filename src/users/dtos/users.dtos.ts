import { TGender, User } from 'src/typeorm/entities/user.entity';

export class UpdateUserDto implements Partial<Omit<User, 'id' | 'avatar'>> {
  firstName?: string;
  lastName?: string;
  avatar?: Express.Multer.File;
  country?: string;
  gender?: TGender;
  status?: string;
}
