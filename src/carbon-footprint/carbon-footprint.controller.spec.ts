import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintController } from './carbon-footprint.controller';

describe('CarbonFootprintController', () => {
  let controller: CarbonFootprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonFootprintController],
    }).compile();

    controller = module.get<CarbonFootprintController>(
      CarbonFootprintController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
