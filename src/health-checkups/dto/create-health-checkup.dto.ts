import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHealthCheckupDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNotEmpty()
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };

  @IsNumber()
  @IsNotEmpty()
  hemoglobinLevel: number;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString({ each: true })
  recommendedActions: string[];
}
