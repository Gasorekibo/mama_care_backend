import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NotificationDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsString()
  type: string;
  @IsNotEmpty()
  @IsNumber()
  sender: number;
  @IsOptional()
  @IsNumber()
  hospitalId: number;
  @IsOptional()
  data: {
    [key: string]: any;
  };
}
