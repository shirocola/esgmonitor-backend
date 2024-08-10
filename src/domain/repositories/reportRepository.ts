import { CarbonFootprintEntry } from '../entities/carbonFootprintEntry';

export interface ReportRepository {
  generateReport(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
    format: 'pdf' | 'excel', // Add format parameter here
  ): Promise<string>;
}
