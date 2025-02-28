import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { HealthcareFacility } from '../healthcare_facilities.entity/healthcare_facilities.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  senderUser: User;

  @Column({ name: 'senderId' })
  sender: number;

  @ManyToOne(() => HealthcareFacility, { nullable: true })
  @JoinColumn({ name: 'hospitalId' })
  hospital: HealthcareFacility;

  @Column({ nullable: true })
  hospitalId: number;

  @Column()
  type: string;

  @Column('jsonb')
  data: { [key: string]: any };
}
