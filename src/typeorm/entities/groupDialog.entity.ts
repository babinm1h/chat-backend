import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Base } from '../base';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('GroupDialog')
export class GroupDialog extends Base {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @Column('int')
  creatorId: number;

  @OneToMany(() => Message, (message) => message.dialog, {
    cascade: ['insert', 'remove', 'update'],
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  messages: Message[];

  @OneToOne(() => Message, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  lastMessage: Message;

  @Column()
  title: string;

  @Column({ nullable: true })
  avatar?: string;

  @ManyToMany(() => User, (user) => user.groupDialogs, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  users: User[];
}
