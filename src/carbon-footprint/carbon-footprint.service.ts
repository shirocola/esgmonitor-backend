import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonFootprint } from './carbon-footprint.entity';
import { CreateCarbonFootprintDto } from './dto/create-carbon-footprint.dto';
@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonFootprint)
    private carbonFootprintRepository: Repository<CarbonFootprint>,
  ) {}

  create(
    createCarbonFootprintDto: CreateCarbonFootprintDto,
  ): Promise<CarbonFootprint> {
    const carbonFootprint = this.carbonFootprintRepository.create(
      createCarbonFootprintDto,
    );
    return this.carbonFootprintRepository.save(carbonFootprint);
  }

  findAll(): Promise<CarbonFootprint[]> {
    return this.carbonFootprintRepository.find();
  }
}
