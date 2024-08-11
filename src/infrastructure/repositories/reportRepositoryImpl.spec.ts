import { ReportRepositoryImpl } from './report.repositoryImpl';
import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('ReportRepositoryImpl', () => {
  let reportRepository: ReportRepositoryImpl;

  beforeEach(() => {
    reportRepository = new ReportRepositoryImpl();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a report and return the file path', async () => {
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

    const mockedReportPath = '/mocked/path/reports/carbon-footprint-report.pdf';

    // Mocking path and fs methods
    (path.join as jest.Mock).mockReturnValue(mockedReportPath);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const reportPath = await reportRepository.generateReport(
      entries,
      startDate,
      endDate,
      'pdf', // Specify the format here
    );

    // Assertions
    expect(path.join).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String),
      'reports',
      'carbon-footprint-report.pdf', // Ensure the extension matches the expected format
    );
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockedReportPath), {
      recursive: true,
    });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockedReportPath,
      expect.stringContaining('Report for entries from'),
    );
    expect(reportPath).toBe(mockedReportPath);
  });

  it('should handle empty entries array', async () => {
    const entries: CarbonFootprintEntry[] = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    const mockedReportPath = '/mocked/path/reports/carbon-footprint-report.pdf';

    // Mocking path and fs methods
    (path.join as jest.Mock).mockReturnValue(mockedReportPath);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const reportPath = await reportRepository.generateReport(
      entries,
      startDate,
      endDate,
      'pdf',
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockedReportPath,
      expect.stringContaining('[]'),
    );
    expect(reportPath).toBe(mockedReportPath);
  });

  it('should throw an error if writing to the file fails', async () => {
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

    const mockedReportPath = '/mocked/path/reports/carbon-footprint-report.pdf';

    // Mocking path and fs methods
    (path.join as jest.Mock).mockReturnValue(mockedReportPath);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to write file');
    });

    await expect(
      reportRepository.generateReport(entries, startDate, endDate, 'pdf'),
    ).rejects.toThrow('Failed to write file');
  });
});
