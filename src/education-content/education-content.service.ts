import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEducationContentDto } from './dto/create-education-content.dto';
import { UpdateEducationContentDto } from './dto/update-education-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationModule } from 'src/dist/education_modules.entity/education_modules.entity';
import { Repository } from 'typeorm';
import { EducationModuleType } from 'src/enums/education-module-type.enum';
import { NotFoundError } from 'rxjs';
import { User } from 'src/dist/user/user.entity';
import { LoginUser } from 'src/user/types/loginUserInterface';

@Injectable()
export class EducationContentService {
  constructor(
    @InjectRepository(EducationModule)
    private readonly educationContentRepository: Repository<EducationModule>,
  ) {}
  async create(
    createEducationContentDto: CreateEducationContentDto,
    user: LoginUser,
  ) {
    try {
      const educationContent = await this.educationContentRepository.create({
        ...createEducationContentDto,
        author: user?.sub.id,
      });
      return await this.educationContentRepository.save(educationContent);
    } catch (error) {
      throw error.message;
    }
  }

  async findAll(type: EducationModuleType): Promise<EducationModule[]> {
    try {
      if (type) {
        const contentByType = await this.educationContentRepository.find({
          where: { type },
        });
        if (contentByType.length === 0) {
          throw new NotFoundException(`No content found for type ${type}`);
        }
        return contentByType;
      } else {
        return await this.educationContentRepository.find();
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<EducationModule> {
    try {
      const content = await this.educationContentRepository.findOne({
        where: { id },
      });
      if (!content) {
        throw new NotFoundException(`No content found for id ${id}`);
      }
      return content;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  update(id: number, updateEducationContentDto: UpdateEducationContentDto) {
    return `This action updates a #${id} educationContent`;
  }

  async remove(id: number) {
    try {
      const content = await this.educationContentRepository.findOne({
        where: { id },
      });
      if (!content)
        throw new NotFoundException(`No content found for id ${id}`);

      await this.educationContentRepository.remove(content);
      return { message: `Education content with id ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
