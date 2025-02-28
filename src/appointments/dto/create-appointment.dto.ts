import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { AppointmentStatus } from 'src/enums/appointment-status.enum';
import { AppointmentType } from 'src/enums/appointment-type';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  start_date: string;

  @IsNotEmpty()
  @IsString()
  end_date: string;

  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status: AppointmentStatus;

  @IsString()
  @IsOptional()
  notes: string;
}
