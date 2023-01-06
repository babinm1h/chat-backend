import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../base';
import { User } from './user.entity';

@Entity('Friend')
export class Friend extends Base {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;
}
