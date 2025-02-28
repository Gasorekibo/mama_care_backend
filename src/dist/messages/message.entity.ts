import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: String;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;
}