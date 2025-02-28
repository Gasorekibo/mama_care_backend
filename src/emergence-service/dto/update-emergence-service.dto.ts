import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergenceServiceDto } from './create-emergence-service.dto';

export class UpdateEmergenceServiceDto extends PartialType(CreateEmergenceServiceDto) {}
