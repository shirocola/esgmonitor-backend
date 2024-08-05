import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  Query,
  Body,
} from '@nestjs/common';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { ViewHistoricalData } from '../../application/usecases/viewHistoricalData';
import { GenerateCarbonFootprintReport } from '../../application/usecases/generateCarbonFootprintReport';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { isValid, parseISO } from 'date-fns';
import { Response } from 'express'; // Importing Response type from express
import * as path from 'path'; // Importing path module
import * as fs from 'fs'; // Importing fs module

@Controller('api/carbon-footprint')
export class CarbonFootprintController {
  constructor(
    private readonly addCarbonFootprintEntry: AddCarbonFootprintEntry,
    private readonly viewHistoricalData: ViewHistoricalData,
    private readonly generateCarbonFootprintReport: GenerateCarbonFootprintReport,
  ) {}

  @Post()
  async addEntry(
    @Body() createCarbonFootprintDto: CreateCarbonFootprintDto,
    @Res() res: Response, // Correctly typing the res object
  ) {
    try {
      const { name, value, unit, date } = createCarbonFootprintDto;
      console.log(
        'Adding new carbon footprint entry:',
        createCarbonFootprintDto,
      );
      const entry = new CarbonFootprintEntry(name, value, unit, new Date(date));
      await this.addCarbonFootprintEntry.execute(entry);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Carbon footprint entry created successfully' });
    } catch (error) {
      console.error('Error in addEntry:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Failed to create entry: ${error.message}` });
    }
  }

  @Get('history')
  async getHistory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CarbonFootprintEntry[]> {
    const start = startDate ? parseISO(startDate) : undefined;
    const end = endDate ? parseISO(endDate) : undefined;

    console.log('Fetching history with parameters:', { startDate, endDate });

    if ((start && !isValid(start)) || (end && !isValid(end))) {
      throw new Error('Invalid date format');
    }

    return this.viewHistoricalData.execute(start, end);
  }

  @Post('report')
  async generateReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ reportPath: string }> {
    try {
      console.log('Generating report with parameters:', { startDate, endDate });

      if (!startDate || !endDate) {
        throw new Error('startDate and endDate query parameters are required');
      }

      // Fetch entries for the specified date range
      const entries = await this.viewHistoricalData.execute(
        new Date(startDate),
        new Date(endDate),
      );

      // Check if entries are fetched correctly
      if (!entries.length) {
        throw new Error('No entries found for the given date range');
      }

      const reportPath = await this.generateCarbonFootprintReport.execute(
        entries,
        new Date(startDate),
        new Date(endDate),
      );

      return { reportPath };
    } catch (error) {
      console.error('Error in generateReport:', error);
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  @Get('report')
  async getReport(@Res() res: Response) {
    try {
      const reportPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'reports',
        'carbon-footprint-report.txt',
      );

      if (!fs.existsSync(reportPath)) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Report not found' });
      }

      res.sendFile(reportPath);
    } catch (error) {
      console.error('Error in getReport:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Failed to retrieve report: ${error.message}` });
    }
  }
}
