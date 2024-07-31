import { CarbonFootprintEntry } from '../entities/carbonFootprintEntry';

export interface CarbonFootprintRepository {
  save(entry: CarbonFootprintEntry): Promise<void>;
  findAll(): Promise<CarbonFootprintEntry[]>;
}
