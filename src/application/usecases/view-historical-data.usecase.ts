import { Injectable, Inject } from '@nestjs/common';
import { CarbonFootprintRepository } from '../../domain/repositories/carbon-footprint.repository';
import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';

@Injectable()
export class ViewHistoricalData {
  constructor(
    @Inject('CarbonFootprintRepository')
    private readonly repository: CarbonFootprintRepository,
  ) {}

  async execute(
    startDate?: Date,
    endDate?: Date,
  ): Promise<CarbonFootprintEntry[]> {
    const allData = await this.repository.findAll();

    if (startDate && endDate) {
      return allData.filter(
        (entry) => entry.date >= startDate && entry.date <= endDate,
      );
    }

    return allData;
  }
}
