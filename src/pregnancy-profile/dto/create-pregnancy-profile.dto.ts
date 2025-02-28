import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { RiskLevel } from 'src/enums/risk-level.enum';

export class CreatePregnancyProfileDto {
  @IsDate()
  @IsNotEmpty()
  lastMenstrualDate: Date;

  @IsDate()
  @IsNotEmpty()
  expectedDueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  gestationalAge: number;

  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsArray()
  @IsOptional()
  medicalHistory: string[];

  @IsArray()
  @IsOptional()
  chronicConditions: string[];
}
