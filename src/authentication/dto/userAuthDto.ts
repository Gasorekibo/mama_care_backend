import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class UserAuthDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

    @IsOptional()
    @IsString()
  profileImageUrl: string;
}
