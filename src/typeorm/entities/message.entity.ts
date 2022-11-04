import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Base } from '../base';
import { Dialog } from './dialog.entity';
import { User } from './user.entity';

@Entity('Message')
export class Message extends Base {
  @Column('text', { nullable: true })
  text: string;

  @Column()
  dialogId: number;

  @OneToOne(() => Dialog, (dialog) => dialog.messages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  dialog: Dialog;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @Column('int')
  creatorId: number;
}
