import { Test, TestingModule } from '@nestjs/testing';
import { PHealthRecordService } from './p-health-record.service';

describe('PHealthRecordService', () => {
  let service: PHealthRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PHealthRecordService],
    }).compile();

    service = module.get<PHealthRecordService>(PHealthRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
