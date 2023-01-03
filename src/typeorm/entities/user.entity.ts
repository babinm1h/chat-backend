import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Base } from '../base';
import { GroupDialog } from './groupDialog.entity';

export type TGender = 'male' | 'female';

@Entity('User')
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => GroupDialog, (groupDialog) => groupDialog.users)
  groupDialogs: GroupDialog[];

  @Column()
  gender: TGender;

  @Column()
  country: string;

  @Column({ default: '' })
  status: string;

  @Column({ nullable: true })
  avatar: string;
}
