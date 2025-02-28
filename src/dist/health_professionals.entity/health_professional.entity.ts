import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HealthcareFacility } from '../healthcare_facilities.entity/healthcare_facilities.entity';
import { ProfessionalStatus } from '../../enums/professionalStatus.enum';
import { EmergencyAlert } from '../emergency_alerts.entity/emergency_alerts.entity';

@Entity()
export class HealthProfessional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column('simple-array')
  professional: Array<string>;

  @Column()
  phone_number: string;
  @Column({
    type: 'enum',
    enum: ProfessionalStatus,
    default: ProfessionalStatus.AVAILABLE,
  })
  status: ProfessionalStatus;
  @ManyToOne(
    () => HealthcareFacility,
    (healthcare_facility) => healthcare_facility.healthProfessionals,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  healthcareFacility: HealthcareFacility;

  @ManyToMany(
    () => EmergencyAlert,
    (emergencyAlert) => emergencyAlert.assignedHealthProfessionals,
  )
  emergencyAlerts: EmergencyAlert[];
}
