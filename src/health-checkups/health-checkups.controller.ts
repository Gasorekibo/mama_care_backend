import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HealthCheckupsService } from './health-checkups.service';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth-guard';
import { RoleGuard } from 'src/authorization/role/role.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { Role } from 'src/authorization/role/role.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/health-checkups')
export class HealthCheckupsController {
  constructor(private readonly healthCheckupsService: HealthCheckupsService) {}
  @Role(UserRole.COMMUNITY_HEALTH_WORKER)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createHealthCheckupDto: CreateHealthCheckupDto) {
    return this.healthCheckupsService.create(createHealthCheckupDto);
  }

  @Get()
  findAll(@Body('userId') id: number) {
    return this.healthCheckupsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.healthCheckupsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHealthCheckupDto: UpdateHealthCheckupDto,
  ) {
    return this.healthCheckupsService.update(+id, updateHealthCheckupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthCheckupsService.remove(+id);
  }
}
