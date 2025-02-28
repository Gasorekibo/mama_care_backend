import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthCheckupDto } from './create-health-checkup.dto';

export class UpdateHealthCheckupDto extends PartialType(CreateHealthCheckupDto) {}
