import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEmergenceServiceDto {
  @IsNotEmpty()
  location: {
    latitude: number;
    longitude: number;
  };
  @IsNotEmpty()
  user: number
  @IsNotEmpty()
  @IsString()
  emergencyType: string;

  @IsBoolean()
  isResolved: boolean;
  @IsNotEmpty()
  @IsNumber()
  assignedFacilityId: number;
}
