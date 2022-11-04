import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Base } from '../base';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('Dialog')
export class Dialog extends Base {
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @Column('int')
  creatorId: number;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;

  @Column('int')
  receiverId: number;

  @OneToMany(() => Message, (message) => message.dialog, {
    cascade: ['insert', 'remove', 'update'],
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  messages: Message[];

  @OneToOne(() => Message, { createForeignKeyConstraints: false })
  @JoinColumn()
  lastMessage: Message;
}
