import { Injectable, Inject } from '@nestjs/common';
import { ReportRepository } from '../../domain/repositories/reportRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

@Injectable() // Ensure this class is marked as injectable
export class GenerateCarbonFootprintReport {
  constructor(
    @Inject('ReportRepository') // Use the injection token consistently
    private readonly reportRepository: ReportRepository,
  ) {}

  async execute(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    try {
      console.log('Executing GenerateCarbonFootprintReport...');
      console.log('Entries:', entries);
      console.log('Start Date:', startDate, 'End Date:', endDate);

      if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error('Entries array is empty or not provided.');
      }

      if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error('Invalid start date.');
      }

      if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        throw new Error('Invalid end date.');
      }

      // Log entries and dates before generating the report
      console.log('Generating report with the following parameters:');
      console.log('Entries:', entries);
      console.log('Start Date:', startDate.toISOString());
      console.log('End Date:', endDate.toISOString());

      const reportUrl = await this.reportRepository.generateReport(
        entries,
        startDate,
        endDate,
      );

      console.log('Report generated successfully:', reportUrl);
      return reportUrl;
    } catch (error) {
      console.error('Error in GenerateCarbonFootprintReport:', error);
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }
}
