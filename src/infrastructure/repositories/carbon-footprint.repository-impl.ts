import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonFootprintRepository } from '../../domain/repositories/carbon-footprint.repository';
import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';
import { CarbonFootprintEntity } from '../orm/carbon-footprint.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarbonFootprintRepositoryImpl
  implements CarbonFootprintRepository
{
  constructor(
    @InjectRepository(CarbonFootprintEntity)
    private readonly carbonFootprintRepo: Repository<CarbonFootprintEntity>,
  ) {}
  async getRealTimeData(): Promise<CarbonFootprintEntry[]> {
    const entities = await this.carbonFootprintRepo.find({
      where: {
        /* Add your conditions for real-time data here */
      },
      order: { date: 'DESC' }, // Example ordering by date
    });
    return entities.map(
      (entity) =>
        new CarbonFootprintEntry(
          entity.name,
          entity.value,
          entity.unit,
          entity.date,
        ),
    );
  }

  async save(entry: CarbonFootprintEntry): Promise<void> {
    const entity = this.carbonFootprintRepo.create(entry);
    await this.carbonFootprintRepo.save(entity);
  }

  async findAll(): Promise<CarbonFootprintEntry[]> {
    const entities = await this.carbonFootprintRepo.find();
    return entities.map(
      (entity) =>
        new CarbonFootprintEntry(
          entity.name,
          entity.value,
          entity.unit,
          entity.date,
        ),
    );
  }
}
