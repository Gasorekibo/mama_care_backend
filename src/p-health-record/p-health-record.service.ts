import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePHealthRecordDto } from './dto/create-p-health-record.dto';
import { UpdatePHealthRecordDto } from './dto/update-p-health-record.dto';
import { PregnancyHealthRecord } from 'src/dist/pHealthRecords.entity/pregnantHealtRecord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PHealthRecordService {
  constructor(
    @InjectRepository(PregnancyHealthRecord)
    private healthRecordRepository: Repository<PregnancyHealthRecord>,
    private userServices: UserService,
  ) {}
  async create(
    createPHealthRecordDto: CreatePHealthRecordDto,
    id: number,
  ): Promise<PregnancyHealthRecord> {
    try {
      const isHealthRecordExist = await this.healthRecordRepository.findOne({
        where: { user: { id } },
      });
      if (isHealthRecordExist) {
        throw new NotFoundException(
          'Health record already exist for this user',
        );
      }
      const pregnantWoman = await this.userServices.getUser(id);
      if (!pregnantWoman || pregnantWoman?.role !== 'PREGNANT_WOMAN') {
        throw new NotFoundException(
          'Can not update health record for non existent user',
        );
      }
      const healthRecord = await this.healthRecordRepository.create({
        ...createPHealthRecordDto,
        user: pregnantWoman,
      });
      return await this.healthRecordRepository.save(healthRecord);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all pHealthRecord`;
  }

  async findOne(id: number) {
    try {
      const healthRecord = await this.healthRecordRepository.findOne({
        where: { id },
      });
      if (!healthRecord) {
        throw new NotFoundException('No health record found');
      }
      return healthRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateBasicHealthRecords(
    id: number,
    updatePHealthRecordDto: UpdatePHealthRecordDto,
  ) {
    try {
      const user = await this.userServices.getUser(id);
      const { pregnancyHealthRecords } = user;
      const recordToUpdate = pregnancyHealthRecords[0];
      if (!recordToUpdate) {
        throw new NotFoundException('No health record found for this user');
      }
      const updatedData = {
        ...recordToUpdate,
        [updatePHealthRecordDto.key]: updatePHealthRecordDto.value,
      };
      return await this.healthRecordRepository.save(updatedData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateAllHealthRecords(
    id: number,
    updatePHealthRecordDto: UpdatePHealthRecordDto,
  ): Promise<PregnancyHealthRecord> {
    try {
      const user = await this.userServices.getUser(id);
      const { pregnancyHealthRecords } = user;
      const recordToUpdate = pregnancyHealthRecords[0];
      if (!recordToUpdate) {
        throw new NotFoundException('No health record found for this user');
      }
      const {id:healthId, ...columnsToUpdates} = updatePHealthRecordDto; 
      const updatedData = {
        ...recordToUpdate,
        ...columnsToUpdates,
      };
      const result = await this.healthRecordRepository.save(updatedData);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} pHealthRecord`;
  }
}
