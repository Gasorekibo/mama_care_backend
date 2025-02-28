import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { HealthProfessionalService } from './health-professional.service';
import { CreateHealthProfessionalDto } from './dto/create-health-professional.dto';
import { UpdateHealthProfessionalDto } from './dto/update-health-professional.dto';
import { ProfessionalStatus } from '../enums/professionalStatus.enum';
@Controller('api/v1/health-professional')
export class HealthProfessionalController {
  constructor(
    private readonly healthProfessionalService: HealthProfessionalService,
  ) {}

  @Post('/new/:id')
  create(
    @Body() createHealthProfessionalDto: CreateHealthProfessionalDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.healthProfessionalService.create(
      createHealthProfessionalDto,
      id,
    );
  }
  @Patch('/status/:id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ProfessionalStatus,
  ) {
    return this.healthProfessionalService.updateStatus(id, status);
  }

  @Get()
  findAll() {
    return this.healthProfessionalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthProfessionalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHealthProfessionalDto: UpdateHealthProfessionalDto,
  ) {
    return this.healthProfessionalService.update(
      +id,
      updateHealthProfessionalDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthProfessionalService.remove(+id);
  }
}
