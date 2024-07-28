import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintService } from './carbon-footprint.service';

describe('CarbonFootprintService', () => {
  let service: CarbonFootprintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarbonFootprintService],
    }).compile();

    service = module.get<CarbonFootprintService>(CarbonFootprintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
