import { Inject, Injectable } from '@nestjs/common';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

@Injectable()
export class AddCarbonFootprintEntry {
  findAll(): CarbonFootprintEntry[] | PromiseLike<CarbonFootprintEntry[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject('CarbonFootprintRepository')
    private readonly repository: CarbonFootprintRepository,
  ) {}

  async execute(entry: CarbonFootprintEntry): Promise<void> {
    entry.validate();
    await this.repository.save(entry);
    console.log(`Carbon footprint entry saved: ${JSON.stringify(entry)}`);
  }
}
