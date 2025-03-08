import { IsEmail, IsPhoneNumber } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PregnancyProfile } from '../pregnancy-profile.entity/pregnancy-profile.entity';
import { HealthCheckup } from '../health_checkups.entity/health_checkups.entity';
import { Appointment } from '../appointments.entity/appointments.entity';
import { Location } from '../location.entity/location.entity';
import { PregnancyHealthRecord } from '../pHealthRecords.entity/pregnantHealtRecord.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  full_name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @IsPhoneNumber()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PREGNANT_WOMAN,
  })
  role: UserRole;

  @Column({
    nullable: true,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvTP1iEsFlSIMm_5drt4-qncPpeaji0_TcosoE4a4xf1eAJKNW9ybwiGToqfj4kQITvK4&usqp=CAU',
  })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToOne(() => PregnancyProfile, (profile) => profile.user)
  pregnancyProfile: PregnancyProfile;

  @OneToMany(() => HealthCheckup, (checkup) => checkup.user)
  healthCheckups: HealthCheckup[];

  @OneToMany(() => Appointment, (appointment) => appointment.healthWorker)
  appointments: Appointment[];
  @OneToMany(() => PregnancyHealthRecord, (record) => record.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pregnancyHealthRecords: PregnancyHealthRecord[];
  @ManyToOne(() => Location, {
    eager: true,
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  location: Location;
}
