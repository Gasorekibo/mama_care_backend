import { IsNotEmpty, IsString } from "class-validator";

export class HealthFacilityLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}