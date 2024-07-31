import { Injectable, Inject } from '@nestjs/common';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

@Injectable()
export class CarbonFootprintService {
  constructor(
    @Inject('CarbonFootprintRepository') // Ensure the token matches the one provided in the AppModule
    private readonly repository: CarbonFootprintRepository,
  ) {}

  async findAll(): Promise<CarbonFootprintEntry[]> {
    return this.repository.findAll();
  }
}
