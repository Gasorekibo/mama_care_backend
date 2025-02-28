import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../location.entity/location.entity';
import { EmergencyAlert } from '../emergency_alerts.entity/emergency_alerts.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { HealthProfessional } from '../health_professionals.entity/health_professional.entity';

@Entity()
export class HealthcareFacility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Location, {
    eager: true,
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  @Column('simple-array')
  servicesOffered: string[];

  @Column({ unique: true, nullable: false })
  contactNumber: string;

  @Column({ unique: false, nullable: false })
  password: string;

  @Column({ nullable: false, default: UserRole.HOSPITAL })
  role: UserRole;
  @OneToMany(
    () => EmergencyAlert,
    (emergencyAlert) => emergencyAlert.assignedFacility,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  emergencyAlerts: EmergencyAlert[];
  @OneToMany(
    () => HealthProfessional,
    (healthProfessional) => healthProfessional.healthcareFacility,
  )
  healthProfessionals: HealthProfessional[];
  @Column({ unique: true, nullable: false })
  email: string;

  @Column('time')
  openingTime: string;

  @Column('time')
  closingTime: string;
  @Column({
    nullable: true,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8MOvvaxkrLPSehZzvLBfMJM2Xk6UL1AVL8w&s',
  })
  profilePicture: string;
}
