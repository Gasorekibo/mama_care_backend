import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckupsController } from './health-checkups.controller';
import { HealthCheckupsService } from './health-checkups.service';

describe('HealthCheckupsController', () => {
  let controller: HealthCheckupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckupsController],
      providers: [HealthCheckupsService],
    }).compile();

    controller = module.get<HealthCheckupsController>(HealthCheckupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
