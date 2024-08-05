import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintController } from './carbonFootprintController';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { ViewHistoricalData } from '../../application/usecases/viewHistoricalData';
import { GenerateCarbonFootprintReport } from '../../application/usecases/generateCarbonFootprintReport';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

describe('CarbonFootprintController', () => {
  let carbonFootprintController: CarbonFootprintController;
  let addCarbonFootprintEntry: AddCarbonFootprintEntry;
  let viewHistoricalData: ViewHistoricalData;
  let generateCarbonFootprintReport: GenerateCarbonFootprintReport;

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
        {
          provide: GenerateCarbonFootprintReport,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue('/path/to/generated/report.txt'),
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
    generateCarbonFootprintReport = module.get<GenerateCarbonFootprintReport>(
      GenerateCarbonFootprintReport,
    );
  });

  describe('addEntry', () => {
    it('should add a carbon footprint entry', async () => {
      const dto: CreateCarbonFootprintDto = {
        name: 'electricity',
        value: 100,
        unit: 'kWh',
        date: new Date().toISOString(),
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await carbonFootprintController.addEntry(dto, response);

      expect(addCarbonFootprintEntry.execute).toHaveBeenCalledWith(
        expect.any(CarbonFootprintEntry),
      );
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Carbon footprint entry created successfully',
      });
    });

    it('should handle errors when adding a carbon footprint entry', async () => {
      const dto: CreateCarbonFootprintDto = {
        name: 'electricity',
        value: 100,
        unit: 'kWh',
        date: new Date().toISOString(),
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jest
        .spyOn(addCarbonFootprintEntry, 'execute')
        .mockRejectedValue(new Error('Error adding entry'));

      await carbonFootprintController.addEntry(dto, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Failed to create entry: Error adding entry',
      });
    });
  });

  describe('getHistory', () => {
    it('should return historical data with startDate and endDate', async () => {
      const startDate = '2023-01-01T00:00:00.000Z';
      const endDate = '2023-01-31T00:00:00.000Z';

      jest.spyOn(viewHistoricalData, 'execute').mockResolvedValue([]);

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

    it('should return historical data without startDate and endDate', async () => {
      jest.spyOn(viewHistoricalData, 'execute').mockResolvedValue([]);

      const result = await carbonFootprintController.getHistory();

      expect(viewHistoricalData.execute).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual([]);
    });

    it('should handle invalid date format', async () => {
      await expect(
        carbonFootprintController.getHistory('invalid-date', '2023-01-31'),
      ).rejects.toThrow('Invalid date format');
    });
  });

  describe('generateReport', () => {
    it('should generate a report for the given date range', async () => {
      const startDate = '2023-01-01T00:00:00.000Z';
      const endDate = '2023-01-31T00:00:00.000Z';

      jest
        .spyOn(viewHistoricalData, 'execute')
        .mockResolvedValue([
          new CarbonFootprintEntry(
            'electricity',
            100,
            'kWh',
            new Date(startDate),
          ),
        ]);

      const result = await carbonFootprintController.generateReport(
        startDate,
        endDate,
      );

      expect(viewHistoricalData.execute).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
      expect(generateCarbonFootprintReport.execute).toHaveBeenCalledWith(
        [
          new CarbonFootprintEntry(
            'electricity',
            100,
            'kWh',
            new Date(startDate),
          ),
        ],
        new Date(startDate),
        new Date(endDate),
      );
      expect(result).toEqual({
        reportPath: '/path/to/generated/report.txt',
      });
    });

    it('should handle errors when generating a report', async () => {
      const startDate = '2023-01-01T00:00:00.000Z';
      const endDate = '2023-01-31T00:00:00.000Z';

      jest
        .spyOn(viewHistoricalData, 'execute')
        .mockResolvedValue([
          new CarbonFootprintEntry(
            'electricity',
            100,
            'kWh',
            new Date(startDate),
          ),
        ]);

      jest
        .spyOn(generateCarbonFootprintReport, 'execute')
        .mockRejectedValue(new Error('Error generating report'));

      await expect(
        carbonFootprintController.generateReport(startDate, endDate),
      ).rejects.toThrow('Failed to generate report: Error generating report');
    });
  });

  describe('getReport', () => {
    it('should return the report file', async () => {
      const response = {
        sendFile: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      await carbonFootprintController.getReport(response);

      expect(fs.existsSync).toHaveBeenCalledWith(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          'reports',
          'carbon-footprint-report.txt',
        ),
      );
      expect(response.sendFile).toHaveBeenCalledWith(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          'reports',
          'carbon-footprint-report.txt',
        ),
      );
    });

    it('should return a 404 if the report file is not found', async () => {
      const response = {
        sendFile: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await carbonFootprintController.getReport(response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Report not found',
      });
    });

    it('should handle errors when retrieving the report file', async () => {
      const response = {
        sendFile: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(fs, 'existsSync').mockImplementation(() => {
        throw new Error('File system error');
      });

      await carbonFootprintController.getReport(response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve report: File system error',
      });
    });
  });
});
