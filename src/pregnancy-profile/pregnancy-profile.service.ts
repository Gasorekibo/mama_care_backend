import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePregnancyProfileDto } from './dto/create-pregnancy-profile.dto';
import { UpdatePregnancyProfileDto } from './dto/update-pregnancy-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PregnancyProfile } from 'src/dist/pregnancy-profile.entity/pregnancy-profile.entity';
import { Repository } from 'typeorm';
import { LoginUser } from 'src/user/types/loginUserInterface';

@Injectable()
export class PregnancyProfileService {
  constructor(
    @InjectRepository(PregnancyProfile)
    private pregnancyProfileRepository: Repository<PregnancyProfile>,
  ) {}
  async create(
    user: LoginUser,
    createPregnancyProfileDto: CreatePregnancyProfileDto,
  ) {
    const { sub } = user;
    try {
      const pregnancyProfile = await this.pregnancyProfileRepository.create({
        ...createPregnancyProfileDto,
        user: sub,
      });
      await this.pregnancyProfileRepository.save(pregnancyProfile);
      return pregnancyProfile;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all pregnancyProfile`;
  }

  async findOne(loginUserId: LoginUser, id: number) {
    try {
      const pregnancyProfile = await this.pregnancyProfileRepository.findOne({
        where: [{ id }, { user: loginUserId.sub }],
        relations: ['user'],
      });
      if (!pregnancyProfile) {
        throw new NotFoundException('Pregnancy profile not found');
      }
      return pregnancyProfile;
    } catch (error) {}
  }

  update(id: number, updatePregnancyProfileDto: UpdatePregnancyProfileDto) {
    return `This action updates a #${id} pregnancyProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} pregnancyProfile`;
  }
}
