import { Module } from '@nestjs/common';
import { EducationContentService } from './education-content.service';
import { EducationContentController } from './education-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationModule } from 'src/dist/education_modules.entity/education_modules.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EducationModule])],
  controllers: [EducationContentController],
  providers: [EducationContentService],
})
export class EducationContentModule {}
