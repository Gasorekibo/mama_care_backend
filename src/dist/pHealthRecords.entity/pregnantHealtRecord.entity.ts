import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class PregnancyHealthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column('json', { nullable: true })
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };

  @Column({ type: 'float', nullable: true })
  hemoglobinLevel: number;

  @Column({ type: 'float', nullable: true })
  fetalHeartRate: number;

  @Column({ type: 'int', nullable: true })
  fetalMovements: number;

  @Column({ type: 'int', nullable: true })
  weekOfPregnancy: number;

  @Column('json', { nullable: true })
  bloodSugar: {
    fasting: number;
    postMeal: number;
  };

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ nullable: true })
  urineProtein: string;

  @Column({ nullable: true })
  swellingLevel: string;

  @Column({ type: 'float', nullable: true })
  ironLevel: number;

  @Column({ type: 'float', nullable: true })
  vitaminD: number;

  @Column({ nullable: true })
  mood: string;

  @Column({ type: 'float', nullable: true })
  sleepHours: number;

  @Column('simple-array', { nullable: true })
  symptoms: string[];

  @Column('json', { nullable: true })
  nutrition: {
    calories: number;
    protein: number;
    hydration: number;
    supplements: string[];
  };

  @Column('json', { nullable: true })
  exercise: {
    type: string;
    duration: number;
    intensity: string;
  };

  @Column('simple-array', { nullable: true })
  contractions: string[];

  @ManyToOne(() => User, (user) => user.pregnancyHealthRecords)
  user: User;
}
