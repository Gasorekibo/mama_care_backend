import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentLoginUser } from 'src/authentication/decorator/get-loginUser';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth-guard';
import { LoginUser } from 'src/user/types/loginUserInterface';
import { CreateEmergenceServiceDto } from './dto/create-emergence-service.dto';
import { UpdateEmergenceServiceDto } from './dto/update-emergence-service.dto';
import { EmergenceServiceService } from './emergence-service.service';
import { HealthProfessional } from 'src/dist/health_professionals.entity/health_professional.entity';
@Controller('api/v1/emergence-alert')
@UseGuards(JwtAuthGuard)
export class EmergenceServiceController {
  constructor(
    private readonly emergenceServiceService: EmergenceServiceService,
  ) {}

  @Post()
  async create(
    @CurrentLoginUser() user: LoginUser,
    @Body() createEmergenceServiceDto: CreateEmergenceServiceDto,
  ) {
    return await this.emergenceServiceService.create(
      user,
      createEmergenceServiceDto,
    );
  }

  @Get()
  findAll() {
    return this.emergenceServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emergenceServiceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmergenceServiceDto: UpdateEmergenceServiceDto,
  ) {
    return this.emergenceServiceService.update(+id, updateEmergenceServiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emergenceServiceService.remove(id);
  }
  @Patch('assign-health-professionals/:emergencyAlertId')
  async assignHealthProfessionalsToAnEmergencyAlert(
    @Body('healthProfessionals') healthProfessionals: { id: number }[],
    @Param('emergencyAlertId', ParseIntPipe) emergencyAlertId: number,
  ) {
    return this.emergenceServiceService.assignHealthProfessionalToAnEmergenceAlert(
      healthProfessionals,
      emergencyAlertId,
    );
  }
  @Patch('assigned-health-professionals/status/:emergencyAlertId')
  async updateHealthProfessionalStatus(
    @Param('emergencyAlertId', ParseIntPipe) emergencyAlertId: number,
    @Body() data,
  ) {
    const { healthProfessionalsId, status } = data;
    {
      return this.emergenceServiceService.updateAssignedHealthProfessionalStatus(
        emergencyAlertId,
        healthProfessionalsId,
        status,
      );
    }
  }
}
