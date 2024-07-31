import { Controller, Post, Body } from '@nestjs/common';
import { AddCarbonFootprintEntry } from '../../application/usecases/addCarbonFootprintEntry';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { CreateCarbonFootprintDto } from '../dto/createCarbonFootprintDto';

@Controller('carbon-footprint')
export class CarbonFootprintController {
  constructor(
    private readonly addCarbonFootprintEntry: AddCarbonFootprintEntry,
  ) {}

  @Post()
  async addEntry(
    @Body() createCarbonFootprintDto: CreateCarbonFootprintDto,
  ): Promise<void> {
    const { name, value, unit, date } = createCarbonFootprintDto;
    const entry = new CarbonFootprintEntry(name, value, unit, new Date(date));

    await this.addCarbonFootprintEntry.execute(entry);
  }
}
