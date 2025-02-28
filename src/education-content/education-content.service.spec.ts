import { Test, TestingModule } from '@nestjs/testing';
import { EducationContentService } from './education-content.service';

describe('EducationContentService', () => {
  let service: EducationContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationContentService],
    }).compile();

    service = module.get<EducationContentService>(EducationContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
