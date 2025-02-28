import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dist/user/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        relations: ['healthCheckups', 'pregnancyHealthRecords'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['healthCheckups', 'pregnancyHealthRecords'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProfilePicture(
    id: number,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      const user = await this.getUser(id);
      const { url } = await this.cloudinaryService.uploadFile(file);
      user.profileImageUrl = url;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
