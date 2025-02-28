import { Module } from '@nestjs/common';
import { PHealthRecordService } from './p-health-record.service';
import { PHealthRecordController } from './p-health-record.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PregnancyHealthRecord } from 'src/dist/pHealthRecords.entity/pregnantHealtRecord.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PregnancyHealthRecord]), UserModule],
  controllers: [PHealthRecordController],
  providers: [PHealthRecordService],
})
export class PHealthRecordModule {}
