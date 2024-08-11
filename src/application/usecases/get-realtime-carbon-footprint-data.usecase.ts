import { Injectable, Inject } from '@nestjs/common';
import { CarbonFootprintRepository } from '../../domain/repositories/carbon-footprint.repository';
import { CarbonFootprintEntry } from 'src/domain/entities/carbon-footprint-entry.entity';

@Injectable()
export class GetRealTimeCarbonFootprintData {
  constructor(
    @Inject('CarbonFootprintRepository') // Add this decorator
    private readonly carbonFootprintRepository: CarbonFootprintRepository,
  ) {}

  async execute(): Promise<CarbonFootprintEntry[]> {
    try {
      return await this.carbonFootprintRepository.getRealTimeData();
    } catch (error) {
      console.error('Error in getRealTimeCarbonFootprintData:', error);
      throw new Error(`Failed to fetch real-time data: ${error.message}`);
    }
  }
}
