import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsMilitaryTime,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString
} from 'class-validator';

export class CreateHealthFacilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  location: {
    latitude: number;
    longitude: number;
    region: string;
    province: string;
    address: string;
  };
  @IsNotEmpty({ each: true })
  @IsArray({ each: true })
  servicesOffered: string[];
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  contactNumber: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsBoolean()
  @IsNotEmpty()
  hasEmergencyServices: boolean;
  @IsOptional()
  @IsMilitaryTime()
  openingTime: string;
  @IsOptional()
  @IsMilitaryTime()
  closingTime: string;
}
