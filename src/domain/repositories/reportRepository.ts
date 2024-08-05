import { CarbonFootprintEntry } from '../entities/carbonFootprintEntry';

export interface ReportRepository {
  generateReport(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
  ): Promise<string>;
}
