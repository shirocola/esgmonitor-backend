// src/interfaces/controllers/carbonFootprintController.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintController } from './carbonFootprintController';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { ViewHistoricalData } from '../../application/usecases/viewHistoricalData';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

describe('CarbonFootprintController', () => {
  let carbonFootprintController: CarbonFootprintController;
  let addCarbonFootprintEntry: AddCarbonFootprintEntry;
  let viewHistoricalData: ViewHistoricalData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarbonFootprintController],
      providers: [
        {
          provide: AddCarbonFootprintEntry,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ViewHistoricalData,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    carbonFootprintController = module.get<CarbonFootprintController>(
      CarbonFootprintController,
    );
    addCarbonFootprintEntry = module.get<AddCarbonFootprintEntry>(
      AddCarbonFootprintEntry,
    );
    viewHistoricalData = module.get<ViewHistoricalData>(ViewHistoricalData);
  });

  it('should add a carbon footprint entry', async () => {
    const dto: CreateCarbonFootprintDto = {
      name: 'electricity',
      value: 100,
      unit: 'kWh',
      date: new Date().toISOString(),
    };

    await carbonFootprintController.addEntry(dto);

    expect(addCarbonFootprintEntry.execute).toHaveBeenCalledWith(
      expect.any(CarbonFootprintEntry),
    );
  });

  it('should return historical data with startDate and endDate', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';

    const result = await carbonFootprintController.getHistory(
      startDate,
      endDate,
    );

    expect(viewHistoricalData.execute).toHaveBeenCalledWith(
      new Date(startDate),
      new Date(endDate),
    );
    expect(result).toEqual([]);
  });

  it('should return historical data with only startDate', async () => {
    const startDate = '2023-01-01';

    const result = await carbonFootprintController.getHistory(startDate);

    expect(viewHistoricalData.execute).toHaveBeenCalledWith(
      new Date(startDate),
      undefined,
    );
    expect(result).toEqual([]);
  });

  it('should return historical data with only endDate', async () => {
    const endDate = '2023-01-31';

    const result = await carbonFootprintController.getHistory(
      undefined,
      endDate,
    );

    expect(viewHistoricalData.execute).toHaveBeenCalledWith(
      undefined,
      new Date(endDate),
    );
    expect(result).toEqual([]);
  });

  it('should return historical data without startDate and endDate', async () => {
    const result = await carbonFootprintController.getHistory();

    expect(viewHistoricalData.execute).toHaveBeenCalledWith(
      undefined,
      undefined,
    );
    expect(result).toEqual([]);
  });
});
