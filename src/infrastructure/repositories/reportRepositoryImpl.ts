import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../../domain/repositories/reportRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportRepositoryImpl implements ReportRepository {
  async generateReport(
    entries: CarbonFootprintEntry[],
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    console.log('Generating report for entries:', entries);
    console.log('Report start date:', startDate);
    console.log('Report end date:', endDate);

    // Simulate generating a report and saving it to a file
    const reportContent =
      `Report for entries from ${startDate.toISOString()} to ${endDate.toISOString()}\n\n` +
      JSON.stringify(entries, null, 2);
    const reportPath = path.join(
      __dirname,
      '..',
      '..',
      'reports',
      'carbon-footprint-report.txt',
    );

    // Ensure the reports directory exists
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });

    // Write the report content to a file
    fs.writeFileSync(reportPath, reportContent);

    return reportPath; // Return the path to the report
  }
}
