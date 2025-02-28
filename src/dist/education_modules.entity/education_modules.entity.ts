import { EducationModuleType } from 'src/enums/education-module-type.enum';
import { RiskLevel } from 'src/enums/risk-level.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class EducationModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  author: number;
  @Column({
    type: 'enum',
    enum: EducationModuleType,
  })
  type: EducationModuleType;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
  })
  recommendedForRiskLevel: RiskLevel;
}
