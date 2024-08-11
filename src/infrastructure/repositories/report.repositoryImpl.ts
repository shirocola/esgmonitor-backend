import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../../domain/repositories/report.repository';
import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportRepositoryImpl implements ReportRepository {
  async generateReport(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
    format: 'pdf' | 'excel',
  ): Promise<string> {
    console.log('Generating report for entries:', entries);
    console.log('Report start date:', startDate);
    console.log('Report end date:', endDate);
    console.log('Report format:', format);

    // Determine the file extension based on the format
    const extension = format === 'excel' ? 'xlsx' : 'pdf';
    const reportPath = path.join(
      __dirname,
      '..',
      '..',
      'reports',
      `carbon-footprint-report.${extension}`,
    );

    // Simulate generating a report
    const reportContent =
      `Report for entries from ${startDate.toISOString()} to ${endDate.toISOString()}\n\n` +
      JSON.stringify(entries, null, 2);

    // Ensure the reports directory exists
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });

    // Write the report content to a file (for simplicity, write it as plain text)
    fs.writeFileSync(reportPath, reportContent);

    return reportPath; // Return the path to the report
  }
}
