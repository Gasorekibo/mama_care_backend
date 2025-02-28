import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateHealthFacilityDto } from './dto/create-health-facility.dto';
import { UpdateHealthFacilityDto } from './dto/update-health-facility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/authentication/auth/auth.service';
@Injectable()
export class HealthFacilityService {
  constructor(
    @InjectRepository(HealthcareFacility)
    private healthFacilityRepository: Repository<HealthcareFacility>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}
  async create(
    createHealthFacilityDto: CreateHealthFacilityDto,
  ): Promise<HealthcareFacility> {
    try {
      const { password } = createHealthFacilityDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      createHealthFacilityDto.password = hashedPassword;
      const facility = await this.healthFacilityRepository.create(
        createHealthFacilityDto,
      );

      return await this.healthFacilityRepository.save(facility);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Facility already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async login(entity: HealthcareFacility, userType: string) {
    try {
      return await this.authService.login(entity, userType);
    } catch (error) {
      if (error.message === 'secretOrPrivateKey must have a value') {
        throw new InternalServerErrorException(
          'Authentication configuration error',
        );
      }

      throw error;
    }
  }
  async findAll() {
    return await this.healthFacilityRepository.find({
      relations: ['location', 'emergencyAlerts'],
    });
  }

  async findOne(id: number): Promise<HealthcareFacility> {
    try {
      const facility = await this.healthFacilityRepository.findOne({
        where: { id },
        relations: ['location', 'emergencyAlerts', 'healthProfessionals'],
      });
      if (!facility) {
        throw new NotFoundException(`Facility with id ${id} not found`);
      }
      return facility;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProfilePicture(id: number, file: Express.Multer.File) {
    try {
      const user = await this.findOne(id);
      const { url } = await this.cloudinaryService.uploadFile(file);
      user.profilePicture = url;
      return await this.healthFacilityRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  update(id: number, updateHealthFacilityDto: UpdateHealthFacilityDto) {
    return `This action updates a #${id} healthFacility`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthFacility`;
  }
}
