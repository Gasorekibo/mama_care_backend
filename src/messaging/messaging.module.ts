import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './messaging.gateway';
import { MessageService } from './services/message.service';
import { NotificationService } from './services/notification.service';
import { Message } from 'src/dist/messages/message.entity';
import { Notification } from 'src/dist/notifications/notification.entity';
import { JwtService } from '@nestjs/jwt';
import { EmergenceServiceService } from 'src/emergence-service/emergence-service.service';
import { EmergenceServiceModule } from 'src/emergence-service/emergence-service.module';
import { EmergencyAlert } from 'src/dist/emergency_alerts.entity/emergency_alerts.entity';
import { HealthFacilityModule } from 'src/health-facility/health-facility.module';
import { HealthProfessional } from 'src/dist/health_professionals.entity/health_professional.entity';
import { HealthProfessionalModule } from 'src/health-professional/health-professional.module';
import { HealthFacilityService } from 'src/health-facility/health-facility.service';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthService } from 'src/authentication/auth/auth.service';
import { User } from 'src/dist/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Notification,
      EmergencyAlert,
      HealthProfessional,
      HealthcareFacility,
      User,
    ]),
    EmergenceServiceModule,
    HealthFacilityModule,
  ],
  providers: [
    ChatGateway,
    MessageService,
    NotificationService,
    JwtService,
    EmergenceServiceService,
    HealthFacilityService,
    CloudinaryService,
    AuthService,
  ],
  exports: [MessageService, NotificationService],
})
export class MessagingModule {}
