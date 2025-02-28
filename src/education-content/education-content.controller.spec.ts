import { Test, TestingModule } from '@nestjs/testing';
import { EducationContentController } from './education-content.controller';
import { EducationContentService } from './education-content.service';

describe('EducationContentController', () => {
  let controller: EducationContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationContentController],
      providers: [EducationContentService],
    }).compile();

    controller = module.get<EducationContentController>(EducationContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
