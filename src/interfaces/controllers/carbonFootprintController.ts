import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';
import { ViewHistoricalData } from '../../application/usecases/viewHistoricalData';

@Controller('carbon-footprint')
export class CarbonFootprintController {
  constructor(
    private readonly addCarbonFootprintEntry: AddCarbonFootprintEntry,
    private readonly viewHistoricalData: ViewHistoricalData,
  ) {}

  @Post()
  async addEntry(
    @Body() createCarbonFootprintDto: CreateCarbonFootprintDto,
  ): Promise<void> {
    const { name, value, unit, date } = createCarbonFootprintDto;
    const entry = new CarbonFootprintEntry(name, value, unit, new Date(date));
    await this.addCarbonFootprintEntry.execute(entry);
  }

  @Get('history')
  async getHistory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CarbonFootprintEntry[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.viewHistoricalData.execute(start, end);
  }
}
