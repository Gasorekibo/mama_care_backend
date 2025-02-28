import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationContentDto } from './create-education-content.dto';

export class UpdateEducationContentDto extends PartialType(CreateEducationContentDto) {}
