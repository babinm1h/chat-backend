import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../base';
import { User } from './user.entity';

export enum FriendRequestStatus {
  accepted = 'accepted',
  rejected = 'rejected',
  default = 'default',
}

@Entity('FriendRequest')
export class FriendRequest extends Base {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;

  @Column({ default: FriendRequestStatus.default })
  status: FriendRequestStatus;
}
