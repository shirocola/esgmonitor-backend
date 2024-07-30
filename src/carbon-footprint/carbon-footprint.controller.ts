import { Controller, Get, Post, Body } from '@nestjs/common';
import { CarbonFootprintService } from './carbon-footprint.service';
import { CreateCarbonFootprintDto } from './dto/create-carbon-footprint.dto';
import { CarbonFootprint } from './carbon-footprint.entity';

@Controller('carbon-footprint')
export class CarbonFootprintController {
  constructor(
    private readonly carbonFootprintService: CarbonFootprintService,
  ) {}

  @Post()
  create(
    @Body() createCarbonFootprintDto: CreateCarbonFootprintDto,
  ): Promise<CarbonFootprint> {
    return this.carbonFootprintService.create(createCarbonFootprintDto);
  }

  @Get()
  findAll(): Promise<CarbonFootprint[]> {
    return this.carbonFootprintService.findAll();
  }
}
