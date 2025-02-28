import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePHealthRecordDto {
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  weight: number;

  @IsOptional()
  @IsNotEmpty()
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  hemoglobinLevel: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(200)
  fetalHeartRate: number;
  @IsOptional()
  @IsNumber()
  fetalMovements: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(42)
  weekOfPregnancy: number;

  @IsOptional()
  @IsNotEmpty()
  bloodSugar: {
    fasting: number;
    postMeal: number;
  };

  @IsOptional()
  @IsNumber()
  @Min(35)
  @Max(42)
  temperature: number;

  @IsOptional()
  @IsString()
  urineProtein: string;

  @IsOptional()
  @IsString()
  swellingLevel: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ironLevel: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vitaminD: number;

  @IsOptional()
  @IsString()
  mood: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms: string[];

  @IsOptional()
  @IsNotEmpty()
  nutrition: {
    calories: number;
    protein: number;
    hydration: number;
    supplements: string[];
  };

  @IsOptional()
  @IsNotEmpty()
  exercise: {
    type: string;
    duration: number;
    intensity: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contractions: string[];
}
