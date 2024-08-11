import { CarbonFootprintEntry } from '../entities/carbon-footprint-entry.entity';

export interface CarbonFootprintRepository {
  save(entry: CarbonFootprintEntry): Promise<void>;
  findAll(): Promise<CarbonFootprintEntry[]>;
  getRealTimeData(): Promise<CarbonFootprintEntry[]>;
}
