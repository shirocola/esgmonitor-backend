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
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { parseISO, isValid } from 'date-fns';
import { Response } from 'express';
import * as fs from 'fs';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { GenerateReportDto } from '../dto/generateReportDto';
import { GetRealTimeCarbonFootprintData } from '../../application/usecases/getRealTimeCarbonFootprintData';

@Controller('api/carbon-footprint')
export class CarbonFootprintController {
  constructor(
    private readonly addCarbonFootprintEntry: AddCarbonFootprintEntry,
    private readonly viewHistoricalData: ViewHistoricalData,
    private readonly generateCarbonFootprintReport: GenerateCarbonFootprintReport,
    private readonly getRealtimeCarbonFootprintData: GetRealTimeCarbonFootprintData,
  ) {}

  @Post()
  async addEntry(
    @Body() createCarbonFootprintDto: CreateCarbonFootprintDto,
    @Res() res: Response,
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
    @Body() generateReportDto: GenerateReportDto,
    @Res() res: Response,
  ) {
    const { startDate, endDate, format } = generateReportDto;
    try {
      console.log('Received request to generate report:', {
        startDate,
        endDate,
        format,
      });

      if (!startDate || !endDate || !format) {
        console.error('Missing parameters');
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            'startDate, endDate, and format query parameters are required',
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid startDate or endDate');
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid startDate or endDate' });
      }

      const entries = await this.viewHistoricalData.execute(start, end);

      if (!entries.length) {
        console.error('No entries found for the given date range');
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No entries found for the given date range' });
      }

      const reportPath = await this.generateCarbonFootprintReport.execute(
        entries,
        start,
        end,
        format,
      );

      if (!fs.existsSync(reportPath)) {
        console.error('Generated report file not found at path:', reportPath);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Generated report file not found' });
      }

      const fileUrl = `/api/carbon-footprint/download?path=${encodeURIComponent(reportPath)}`;
      console.log('Report generated successfully. File URL:', fileUrl);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Report generated successfully', fileUrl });
    } catch (error) {
      console.error('Error in generateReport:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Failed to generate report: ${error.message}`,
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('download')
  async downloadReport(
    @Query('path') reportPath: string,
    @Res() res: Response,
  ) {
    try {
      if (!fs.existsSync(reportPath)) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Report not found' });
      }
      res.download(reportPath);
    } catch (error) {
      console.error('Error in downloadReport:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Failed to retrieve report: ${error.message}`,
      });
    }
  }

  @Get('realtime')
  async getRealtimeData(@Res() res: Response) {
    try {
      const data = await this.getRealtimeCarbonFootprintData.execute();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Failed to fetch real-time data: ${error.message}` });
    }
  }
}
