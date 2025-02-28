import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EducationModuleType } from 'src/enums/education-module-type.enum';
import { RiskLevel } from 'src/enums/risk-level.enum';

export class CreateEducationContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum({ type: EducationModuleType })
  @IsNotEmpty()
  type: EducationModuleType;

  @IsString()
  @IsOptional()
  videoUrl: string;

  @IsEnum({ type: RiskLevel })
  @IsOptional()
  recommendedForRiskLevel: RiskLevel;
}
