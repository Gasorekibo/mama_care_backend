import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ProfessionalStatus } from "../../enums/professionalStatus.enum";

export class CreateHealthProfessionalDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString({ each: true })
  @IsNotEmpty()
  professional: string[];

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsEnum(ProfessionalStatus )
  @IsNotEmpty()
  status: ProfessionalStatus;
}
