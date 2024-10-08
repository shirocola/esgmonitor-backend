import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintController } from './carbonFootprintController';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { ViewHistoricalData } from '../../application/usecases/viewHistoricalData';
import { GenerateCarbonFootprintReport } from '../../application/usecases/generateCarbonFootprintReport';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { GenerateReportDto } from '../dto/generateReportDto';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { Response } from 'express';
import * as fs from 'fs';

jest.mock('fs');

describe('CarbonFootprintController', () => {
  let carbonFootprintController: CarbonFootprintController;
  let viewHistoricalData: ViewHistoricalData;
  let generateCarbonFootprintReport: GenerateCarbonFootprintReport;
  let addCarbonFootprintEntry: AddCarbonFootprintEntry;

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
              .mockResolvedValue('/path/to/generated/report.pdf'),
          },
        },
      ],
    }).compile();

    carbonFootprintController = module.get<CarbonFootprintController>(
      CarbonFootprintController,
    );
    viewHistoricalData = module.get<ViewHistoricalData>(ViewHistoricalData);
    generateCarbonFootprintReport = module.get<GenerateCarbonFootprintReport>(
      GenerateCarbonFootprintReport,
    );
    addCarbonFootprintEntry = module.get<AddCarbonFootprintEntry>(
      AddCarbonFootprintEntry,
    );
  });

  describe('generateReport', () => {
    it('should generate a report for the given date range', async () => {
      const dto: GenerateReportDto = {
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-31T00:00:00.000Z',
        format: 'pdf',
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jest
        .spyOn(viewHistoricalData, 'execute')
        .mockResolvedValue([
          new CarbonFootprintEntry(
            'electricity',
            100,
            'kWh',
            new Date(dto.startDate),
          ),
        ]);

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      await carbonFootprintController.generateReport(dto, response);

      expect(viewHistoricalData.execute).toHaveBeenCalledWith(
        new Date(dto.startDate),
        new Date(dto.endDate),
      );
      expect(generateCarbonFootprintReport.execute).toHaveBeenCalledWith(
        [
          new CarbonFootprintEntry(
            'electricity',
            100,
            'kWh',
            new Date(dto.startDate),
          ),
        ],
        new Date(dto.startDate),
        new Date(dto.endDate),
        'pdf',
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Report generated successfully',
        fileUrl:
          '/api/carbon-footprint/download?path=%2Fpath%2Fto%2Fgenerated%2Freport.pdf',
      });
    });

    it('should return 400 for missing parameters', async () => {
      const dto = {
        startDate: '',
        endDate: '',
        format: '',
      } as unknown as GenerateReportDto;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await carbonFootprintController.generateReport(dto, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'startDate, endDate, and format query parameters are required',
      });
    });

    it('should return 404 if no entries are found', async () => {
      const dto: GenerateReportDto = {
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-31T00:00:00.000Z',
        format: 'pdf',
      };

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jest.spyOn(viewHistoricalData, 'execute').mockResolvedValue([]);

      await carbonFootprintController.generateReport(dto, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        message: 'No entries found for the given date range',
      });
    });

    it('should return 400 for invalid dates', async () => {
      const dto = {
        startDate: 'invalid-date',
        endDate: 'invalid-date',
        format: 'pdf',
      } as unknown as GenerateReportDto;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await carbonFootprintController.generateReport(dto, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Invalid startDate or endDate',
      });
    });
  });

  describe('downloadReport', () => {
    it('should return the report file', async () => {
      const response = {
        download: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reportPath = '/mocked/path/reports/carbon-footprint-report.pdf';

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);

      await carbonFootprintController.downloadReport(reportPath, response);

      expect(fs.existsSync).toHaveBeenCalledWith(reportPath);
      expect(response.download).toHaveBeenCalledWith(reportPath);
    });

    it('should return 404 if report file does not exist', async () => {
      const response = {
        download: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reportPath = '/mocked/path/reports/carbon-footprint-report.pdf';

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await carbonFootprintController.downloadReport(reportPath, response);

      expect(fs.existsSync).toHaveBeenCalledWith(reportPath);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Report not found',
      });
    });
  });

  describe('addEntry', () => {
    it('should create a carbon footprint entry successfully', async () => {
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

    it('should return 500 if there is an error creating the entry', async () => {
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
        .mockRejectedValue(new Error('Error creating entry'));

      await carbonFootprintController.addEntry(dto, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Failed to create entry: Error creating entry',
      });
    });
  });

  describe('getHistory', () => {
    it('should return an error for invalid date format', async () => {
      await expect(
        carbonFootprintController.getHistory('invalid-date', '2023-01-31'),
      ).rejects.toThrow('Invalid date format');
    });

    it('should fetch historical data for the given date range', async () => {
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
  });
});
