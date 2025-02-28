import { Test, TestingModule } from '@nestjs/testing';
import { PregnancyProfileService } from './pregnancy-profile.service';

describe('PregnancyProfileService', () => {
  let service: PregnancyProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PregnancyProfileService],
    }).compile();

    service = module.get<PregnancyProfileService>(PregnancyProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
