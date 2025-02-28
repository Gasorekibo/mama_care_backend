import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckupsService } from './health-checkups.service';

describe('HealthCheckupsService', () => {
  let service: HealthCheckupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCheckupsService],
    }).compile();

    service = module.get<HealthCheckupsService>(HealthCheckupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
