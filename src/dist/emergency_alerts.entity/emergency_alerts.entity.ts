import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { HealthcareFacility } from '../healthcare_facilities.entity/healthcare_facilities.entity';
import { HealthProfessional } from '../health_professionals.entity/health_professional.entity';
import { EmergenceStatus } from 'src/enums/emergence.status.enum';

@Entity()
export class EmergencyAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column('jsonb')
  location: {
    latitude: number;
    longitude: number;
  };
  @Column('text')
  emergencyType: string;

  @Column('boolean', { default: false })
  isResolved: boolean;

  @Column('enum', { enum: EmergenceStatus, default: EmergenceStatus.PENDING })
  status: EmergenceStatus;
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => HealthcareFacility,
    (healthcareFacility) => healthcareFacility.emergencyAlerts,
    {
      nullable: false,
      eager: false,
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  assignedFacility: HealthcareFacility;

  @ManyToMany(
    () => HealthProfessional,
    (healthProfessional) => healthProfessional.emergencyAlerts,
  )
  @JoinTable()
  assignedHealthProfessionals: HealthProfessional[];
}
