import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthCheckup } from 'src/dist/health_checkups.entity/health_checkups.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class HealthCheckupsService {
  constructor(
    @InjectRepository(HealthCheckup)
    private readonly healthCheckupRepository: Repository<HealthCheckup>,
    private readonly usersService: UserService,
  ) {}
  async create(
    createHealthCheckupDto: CreateHealthCheckupDto,
  ): Promise<HealthCheckup> {
    try {
      const user = await this.usersService.getUser(
        createHealthCheckupDto.userId,
      );
      const healthCheckup = this.healthCheckupRepository.create({
        ...createHealthCheckupDto,
        user,
      });
      await this.healthCheckupRepository.save(healthCheckup);
      return healthCheckup;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(userId: number): Promise<HealthCheckup[]> {
    try {
      const healthCheckups = await this.healthCheckupRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      return healthCheckups;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} healthCheckup`;
  }

  update(id: number, updateHealthCheckupDto: UpdateHealthCheckupDto) {
    return `This action updates a #${id} healthCheckup`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthCheckup`;
  }
}
