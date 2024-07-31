import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { CarbonFootprintEntity } from '../orm/carbonFootprintEntity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarbonFootprintRepositoryImpl
  implements CarbonFootprintRepository
{
  constructor(
    @InjectRepository(CarbonFootprintEntity)
    private readonly carbonFootprintRepo: Repository<CarbonFootprintEntity>,
  ) {}

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
