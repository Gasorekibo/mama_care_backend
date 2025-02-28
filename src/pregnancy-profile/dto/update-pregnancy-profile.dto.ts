import { PartialType } from '@nestjs/mapped-types';
import { CreatePregnancyProfileDto } from './create-pregnancy-profile.dto';

export class UpdatePregnancyProfileDto extends PartialType(CreatePregnancyProfileDto) {}
