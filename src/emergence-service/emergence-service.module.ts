import { Module } from '@nestjs/common';
import { EmergenceServiceService } from './emergence-service.service';
import { EmergenceServiceController } from './emergence-service.controller';
import { HealthFacilityService } from 'src/health-facility/health-facility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyAlert } from 'src/dist/emergency_alerts.entity/emergency_alerts.entity';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/authentication/auth/auth.service';
import { User } from 'src/dist/user/user.entity';
import { HealthProfessional } from '../dist/health_professionals.entity/health_professional.entity';
import { HealthProfessionalService } from 'src/health-professional/health-professional.service';
import { HealthProfessionalModule } from 'src/health-professional/health-professional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmergencyAlert, HealthcareFacility, User, HealthProfessional]),
    HealthProfessionalModule
  ],
  controllers: [EmergenceServiceController],
  providers: [
    EmergenceServiceService,
    HealthFacilityService,
    CloudinaryService,
    JwtService,
    AuthService,
    HealthProfessionalService
  ],
})
export class EmergenceServiceModule {}
