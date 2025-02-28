import { Module } from '@nestjs/common';
import { HealthProfessionalService } from './health-professional.service';
import { HealthProfessionalController } from './health-professional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthProfessional } from 'src/dist/health_professionals.entity/health_professional.entity';
import { HealthFacilityModule } from '../health-facility/health-facility.module';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { HealthFacilityController } from '../health-facility/health-facility.controller';
import { HealthcareFacility } from '../dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../authentication/auth/auth.service';
import { User } from '../dist/user/user.entity';
import { NearbyHospitalService } from '../health-facility/nearbyHospitalService';
import { EmergencyAlert } from '../dist/emergency_alerts.entity/emergency_alerts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthProfessional, HealthcareFacility, User, EmergencyAlert]),
    HealthFacilityModule,
  ],
  controllers: [HealthProfessionalController, HealthFacilityController],
  providers: [
    HealthProfessionalService,
    HealthFacilityService,
    CloudinaryService,
    JwtService,
    AuthService,
    NearbyHospitalService,
  ],
})
export class HealthProfessionalModule {}
