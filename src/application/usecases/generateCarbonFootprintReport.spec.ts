import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCarbonFootprintReport } from './generateCarbonFootprintReport';
import { ReportRepository } from '../../domain/repositories/reportRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

describe('GenerateCarbonFootprintReport', () => {
  let generateCarbonFootprintReport: GenerateCarbonFootprintReport;
  let reportRepository: ReportRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCarbonFootprintReport,
        {
          provide: 'ReportRepository',
          useValue: {
            generateReport: jest.fn(),
          },
        },
      ],
    }).compile();

    generateCarbonFootprintReport = module.get<GenerateCarbonFootprintReport>(
      GenerateCarbonFootprintReport,
    );
    reportRepository = module.get<ReportRepository>('ReportRepository');
  });

  it('should generate a report and return the report URL', async () => {
    const entries: CarbonFootprintEntry[] = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-01-01'),
      ),
    ];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    jest
      .spyOn(reportRepository, 'generateReport')
      .mockResolvedValue('http://report.com');

    const reportUrl = await generateCarbonFootprintReport.execute(
      entries,
      startDate,
      endDate,
      'excel',
    );

    expect(reportRepository.generateReport).toHaveBeenCalledWith(
      entries,
      startDate,
      endDate,
      'excel',
    );
    expect(reportUrl).toBe('http://report.com');
  });

  it('should throw an error if entries array is empty', async () => {
    const entries: CarbonFootprintEntry[] = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    await expect(
      generateCarbonFootprintReport.execute(
        entries,
        startDate,
        endDate,
        'excel',
      ),
    ).rejects.toThrow('Entries array is empty or not provided.');
  });

  it('should throw an error if start date is invalid', async () => {
    const entries: CarbonFootprintEntry[] = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-01-01'),
      ),
    ];
    const invalidDate = new Date('invalid-date');

    await expect(
      generateCarbonFootprintReport.execute(
        entries,
        invalidDate,
        new Date('2023-01-31'),
        'excel',
      ),
    ).rejects.toThrow('Invalid start date.');
  });

  it('should throw an error if end date is invalid', async () => {
    const entries: CarbonFootprintEntry[] = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-01-01'),
      ),
    ];
    const invalidDate = new Date('invalid-date');

    await expect(
      generateCarbonFootprintReport.execute(
        entries,
        new Date('2023-01-01'),
        invalidDate,
        'excel',
      ),
    ).rejects.toThrow('Invalid end date.');
  });

  it('should handle errors thrown by the report repository', async () => {
    const entries: CarbonFootprintEntry[] = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-01-01'),
      ),
    ];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    jest
      .spyOn(reportRepository, 'generateReport')
      .mockRejectedValue(new Error('Report generation failed'));

    await expect(
      generateCarbonFootprintReport.execute(
        entries,
        startDate,
        endDate,
        'excel',
      ),
    ).rejects.toThrow('Failed to generate report: Report generation failed');
  });
});
