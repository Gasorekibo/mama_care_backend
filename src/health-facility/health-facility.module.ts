import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { HealthFacilityController } from './health-facility.controller';
import { HealthFacilityService } from './health-facility.service';
import { NearbyHospitalService } from './nearbyHospitalService';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/authentication/auth/auth.service';
import { User } from 'src/dist/user/user.entity';
import { HealthProfessional } from 'src/dist/health_professionals.entity/health_professional.entity';
import { HealthProfessionalService } from 'src/health-professional/health-professional.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthcareFacility, User])],

  controllers: [HealthFacilityController],
  providers: [
    HealthFacilityService,
    CloudinaryService,
    NearbyHospitalService,
    JwtService,
    AuthService,
  ],
})
export class HealthFacilityModule {}
