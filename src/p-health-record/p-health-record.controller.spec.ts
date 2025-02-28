import { Test, TestingModule } from '@nestjs/testing';
import { PHealthRecordController } from './p-health-record.controller';
import { PHealthRecordService } from './p-health-record.service';

describe('PHealthRecordController', () => {
  let controller: PHealthRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PHealthRecordController],
      providers: [PHealthRecordService],
    }).compile();

    controller = module.get<PHealthRecordController>(PHealthRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
