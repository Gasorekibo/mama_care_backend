import { Test, TestingModule } from '@nestjs/testing';
import { PregnancyProfileController } from './pregnancy-profile.controller';
import { PregnancyProfileService } from './pregnancy-profile.service';

describe('PregnancyProfileController', () => {
  let controller: PregnancyProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PregnancyProfileController],
      providers: [PregnancyProfileService],
    }).compile();

    controller = module.get<PregnancyProfileController>(PregnancyProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
