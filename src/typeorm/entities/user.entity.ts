import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '../base';

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
}
