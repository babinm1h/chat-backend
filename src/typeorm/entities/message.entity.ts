import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Base } from '../base';
import { Dialog } from './dialog.entity';
import { MessageAttachment } from './messageAttachments.entity';
import { User } from './user.entity';

@Entity('Message')
export class Message extends Base {
  @Column('text', { nullable: true })
  text: string;

  @Column()
  dialogId: number;

  @Column('boolean', { default: false })
  readed: boolean;

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

  @Column('int', { nullable: true })
  replyToMsgId: number;

  @ManyToOne(() => Message, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn()
  replyToMsg: Message;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message)
  @JoinColumn()
  attachments: MessageAttachment[];
}
