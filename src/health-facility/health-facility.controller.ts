import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth-guard';
import { Role } from 'src/authorization/role/role.decorator';
import { RoleGuard } from 'src/authorization/role/role.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { CreateHealthFacilityDto } from './dto/create-health-facility.dto';
import { UpdateHealthFacilityDto } from './dto/update-health-facility.dto';
import { HealthFacilityService } from './health-facility.service';
import { NearbyHospitalService } from './nearbyHospitalService';
import { HealthFacilityLoginDto } from './dto/health-facility-login.dto';
import { LocalAuthGuard } from 'src/authentication/guards/local-auth.guard';

@Controller('api/v1/facility')
export class HealthFacilityController {
  constructor(
    private readonly healthFacilityService: HealthFacilityService,
    private readonly nearbyHospitalService: NearbyHospitalService,
  ) {}
  @UseGuards(RoleGuard)
  @Role(UserRole.HOSPITAL, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHealthFacilityDto: CreateHealthFacilityDto) {
    return this.healthFacilityService.create(createHealthFacilityDto);
  }
  @UseGuards(RoleGuard)
  @Role(
    UserRole.ADMIN,
    UserRole.COMMUNITY_HEALTH_WORKER,
    UserRole.PREGNANT_WOMAN,
  )
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    try {
      return await this.healthFacilityService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const userType = req.body.userType || 'user';
    try {
      return await this.healthFacilityService.login(req?.user, userType);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get('nearby')
  async findNearbyHospitals(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('maxDistance')
    maxDistance?: number,
  ) {
    try {
      return await this.nearbyHospitalService.findNearbyHospitals({
        latitude,
        longitude,
        maxDistance,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.healthFacilityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHealthFacilityDto: UpdateHealthFacilityDto,
  ) {
    return this.healthFacilityService.update(id, updateHealthFacilityDto);
  }
  @UseGuards(RoleGuard)
  @Role(UserRole.HOSPITAL)
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.healthFacilityService.updateProfilePicture(id, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.healthFacilityService.remove(id);
  }
}
