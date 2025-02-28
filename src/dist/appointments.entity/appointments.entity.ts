import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { AppointmentType } from 'src/enums/appointment-type';
import { AppointmentStatus } from 'src/enums/appointment-status.enum';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  owner: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  healthWorker: User;

  @Column({ type: 'varchar', length: 255 })
  start_date: string;

  @Column({ type: 'varchar', length: 255 })
  end_date: string;

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column('text', { nullable: true })
  notes: string;
}
