import { Module } from '@nestjs/common';
import { PregnancyProfileService } from './pregnancy-profile.service';
import { PregnancyProfileController } from './pregnancy-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PregnancyProfile } from 'src/dist/pregnancy-profile.entity/pregnancy-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PregnancyProfile])],
  controllers: [PregnancyProfileController],
  providers: [PregnancyProfileService],
})
export class PregnancyProfileModule {}
