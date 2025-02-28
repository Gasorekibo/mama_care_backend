import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHealthProfessionalDto } from './dto/create-health-professional.dto';
import { UpdateHealthProfessionalDto } from './dto/update-health-professional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthProfessional } from '../dist/health_professionals.entity/health_professional.entity';
import { Repository } from 'typeorm';
import { HealthcareFacility } from '../dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { ProfessionalStatus } from '../enums/professionalStatus.enum';

@Injectable()
export class HealthProfessionalService {
  constructor(
    @InjectRepository(HealthProfessional)
    private healthProfessionalRepository: Repository<HealthProfessional>,
    private healthFacilityService: HealthFacilityService,
  ) {}
  async create(
    createHealthProfessionalDto: CreateHealthProfessionalDto,
    healthFacilityId: number,
  ) {
    try {
      const healthFacility =
        await this.healthFacilityService.findOne(healthFacilityId);
      if (!healthFacility) {
        throw new NotFoundException('Health Facility not found');
      }
      const healthProfessionalExists =
        await this.healthProfessionalRepository.findOne({
          where: { email: createHealthProfessionalDto.email },
        });
      if (healthProfessionalExists) {
        throw new ConflictException('Health Professional already exists');
      } else {
        const healthProfessional = this.healthProfessionalRepository.create(
          createHealthProfessionalDto,
        );
        healthProfessional.healthcareFacility = healthFacility;
        await this.healthProfessionalRepository.save(healthProfessional);
        return healthProfessional;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error creating health professional',
      );
    }
  }

  async updateStatus(id: number, status: ProfessionalStatus) {
    try {
      const healthProfessional = await this.findOne(id);
      healthProfessional.status = status;
      await this.healthProfessionalRepository.save(healthProfessional);
      return healthProfessional;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating professional status',
      );
    }
  }

  findAll() {
    return `This action returns all healthProfessional`;
  }

  async findOne(id: number) {
    try {
      const professional = await this.healthProfessionalRepository.findOne({
        where: { id },
      });
      if (!professional) {
        throw new NotFoundException('Professional not found');
      }
      return professional;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding professional');
    }
  }

  update(id: number, updateHealthProfessionalDto: UpdateHealthProfessionalDto) {
    return `This action updates a #${id} healthProfessional`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthProfessional`;
  }
}
