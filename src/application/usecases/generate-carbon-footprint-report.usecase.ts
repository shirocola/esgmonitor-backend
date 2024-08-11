import { Injectable, Inject } from '@nestjs/common';
import { ReportRepository } from '../../domain/repositories/report.repository';
import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';

@Injectable()
export class GenerateCarbonFootprintReport {
  constructor(
    @Inject('ReportRepository')
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
    format: 'pdf' | 'excel', // Add format parameter
  ): Promise<string> {
    try {
      console.log('Executing GenerateCarbonFootprintReport...');
      console.log('Entries:', entries);
      console.log('Start Date:', startDate, 'End Date:', endDate);
      console.log('Format:', format);

      if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error('Entries array is empty or not provided.');
      }

      if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error('Invalid start date.');
      }

      if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error('Invalid end date.');
      }

      const reportUrl = await this.reportRepository.generateReport(
        entries,
        startDate,
        endDate,
        format, // Pass format parameter
      );

      console.log('Report generated successfully:', reportUrl);
      return reportUrl;
    } catch (error) {
      console.error('Error in GenerateCarbonFootprintReport:', error);
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }
}
