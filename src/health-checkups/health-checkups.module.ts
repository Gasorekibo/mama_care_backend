import { Module } from '@nestjs/common';
import { HealthCheckupsService } from './health-checkups.service';
import { HealthCheckupsController } from './health-checkups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckup } from 'src/dist/health_checkups.entity/health_checkups.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/dist/user/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCheckup, User])],
  controllers: [HealthCheckupsController],
  providers: [HealthCheckupsService, UserService, CloudinaryService],
})
export class HealthCheckupsModule {}
