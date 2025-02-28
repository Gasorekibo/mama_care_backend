import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmergencyAlert } from 'src/dist/emergency_alerts.entity/emergency_alerts.entity';
import { HealthFacilityService } from 'src/health-facility/health-facility.service';
import { LoginUser } from 'src/user/types/loginUserInterface';
import { In, Repository } from 'typeorm';
import { CreateEmergenceServiceDto } from './dto/create-emergence-service.dto';
import { UpdateEmergenceServiceDto } from './dto/update-emergence-service.dto';
import { ProfessionalStatus } from 'src/enums/professionalStatus.enum';
import { HealthProfessional } from 'src/dist/health_professionals.entity/health_professional.entity';
import { EmergenceStatus } from 'src/enums/emergence.status.enum';

@Injectable()
export class EmergenceServiceService {
  constructor(
    @InjectRepository(EmergencyAlert)
    private emergencyAlertRepository: Repository<EmergencyAlert>,
    @InjectRepository(HealthProfessional)
    private healthProfessionalRepository: Repository<HealthProfessional>,
    private readonly healthFacilityService: HealthFacilityService,
  ) {}
  async create(
    user: LoginUser,
    createEmergenceServiceDto: CreateEmergenceServiceDto,
  ): Promise<EmergencyAlert> {
    try {
      const assignedFacility = await this.healthFacilityService.findOne(
        createEmergenceServiceDto.assignedFacilityId,
      );
      const { sub } = user;
      const objectToSave = {
        ...createEmergenceServiceDto,
        user,
        assignedFacility,
      };
      const emergence =
        await this.emergencyAlertRepository.create(objectToSave);

      await this.emergencyAlertRepository.save(emergence);

      return emergence;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<EmergencyAlert[]> {
    return await this.emergencyAlertRepository.find({relations: ['assignedFacility','assignedHealthProfessionals']});
  }

  async findOne(id: number): Promise<EmergencyAlert> {
    try {
      const emergenceAlert = await this.emergencyAlertRepository.findOne({
        where: { id },
        relations: ['user', 'assignedFacility', 'assignedHealthProfessionals'],
      });
      if (!emergenceAlert) {
        throw new NotFoundException('No emergence alert found');
      }
      return emergenceAlert;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateEmergenceServiceDto: UpdateEmergenceServiceDto,
  ) {
    try {
      const emergenceAlert = await this.findOne(id);

      return await this.emergencyAlertRepository.save({
        ...emergenceAlert,
        ...updateEmergenceServiceDto,
        user: emergenceAlert.user,
        assignedFacility: emergenceAlert.assignedFacility,
      });
    } catch (error) {}
  }

  remove(id: number) {
    return `This action removes a #${id} emergenceService`;
  }

  async assignHealthProfessionalToAnEmergenceAlert(
    healthProfessionals: { id: number }[],
    emergencyAlertId: number,
  ) {
    if (!healthProfessionals || healthProfessionals.length === 0) {
      throw new UnauthorizedException('No health professional selected');
    }

    try {
      const alert = await this.findOne(emergencyAlertId);

      if (!alert) {
        throw new NotFoundException(
          `Emergency alert with ID ${emergencyAlertId} not found`,
        );
      }
      const professionalIds = healthProfessionals.map((hp) => hp.id);
      const foundProfessionals = await this.healthProfessionalRepository.find({
        where: { id: In(professionalIds) },
      });

      if (foundProfessionals.length !== professionalIds.length) {
        throw new NotFoundException(
          'One or more health professionals not found',
        );
      }
      for (const professional of foundProfessionals) {
        professional.status = ProfessionalStatus.UNAVAILABLE;
        await this.healthProfessionalRepository.save(professional);
      }
      alert.assignedHealthProfessionals = foundProfessionals;
      alert.status = EmergenceStatus.IN_PROGRESS;
      return await this.emergencyAlertRepository.save(alert);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateAssignedHealthProfessionalStatus(
    emergenceId: number,
    healthProfessionalsId: HealthProfessional[],
    status: ProfessionalStatus,
  ) {
    try {
      const alert = await this.findOne(emergenceId);
      const foundProfessionals = await this.healthProfessionalRepository.find({
        where: { id: In(healthProfessionalsId.map((id) => id)) },
      });
      if (foundProfessionals.length !== healthProfessionalsId.length) {
        throw new NotFoundException(
          'One or more health professionals not found',
        );
      }
      for (const professional of foundProfessionals) {
        professional.status = status;
        await this.healthProfessionalRepository.save(professional);
      }
      return alert;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
