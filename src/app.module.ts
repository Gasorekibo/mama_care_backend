import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TypeOrmConfigService } from './config/database.config';
import { EducationContentModule } from './education-content/education-content.module';
import { EmergenceServiceModule } from './emergence-service/emergence-service.module';
import { HealthCheckupsModule } from './health-checkups/health-checkups.module';
import { HealthFacilityModule } from './health-facility/health-facility.module';
import { MessagingModule } from './messaging/messaging.module';
import { PHealthRecordModule } from './p-health-record/p-health-record.module';
import { PregnancyProfileModule } from './pregnancy-profile/pregnancy-profile.module';
import { UserModule } from './user/user.module';
import { HealthProfessionalModule } from './health-professional/health-professional.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthenticationModule,
    UserModule,
    HealthFacilityModule,
    EmergenceServiceModule,
    PregnancyProfileModule,
    HealthCheckupsModule,
    CloudinaryModule,
    AuthorizationModule,
    EducationContentModule,
    AppointmentsModule,
    PHealthRecordModule,
    MessagingModule,
    HealthProfessionalModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}
  async onApplicationBootstrap() {
    if (this.dataSource.isInitialized) {
      console.log('Database connection initialized successfully');
    }
  }
}
