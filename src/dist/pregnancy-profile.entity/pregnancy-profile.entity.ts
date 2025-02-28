import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { RiskLevel } from 'src/enums/risk-level.enum';

@Entity()
export class PregnancyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {nullable: false})
  @JoinColumn()
  user: User;

  @Column()
  lastMenstrualDate: Date;

  @Column()
  expectedDueDate: Date;

  @Column({ type: 'int' })
  gestationalAge: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.LOW,
  })
  riskLevel: RiskLevel;

  @Column('simple-array', { nullable: true })
  medicalHistory: string[];

  @Column('simple-array', { nullable: true })
  chronicConditions: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
