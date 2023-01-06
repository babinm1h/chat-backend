import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

export enum FileTypes {
  video = 'video',
  image = 'image',
  audio = 'audio',
  file = 'file',
}

@Entity('MessageAttachment')
export class MessageAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  message: Message;

  @Column()
  type: FileTypes;

  @Column()
  path: string;

  @Column({ nullable: true })
  name: string;
}
