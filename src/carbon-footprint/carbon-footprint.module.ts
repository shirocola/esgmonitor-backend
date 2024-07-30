import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonFootprintService } from './carbon-footprint.service';
import { CarbonFootprintController } from './carbon-footprint.controller';
import { CarbonFootprint } from './carbon-footprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonFootprint])],
  providers: [CarbonFootprintService],
  controllers: [CarbonFootprintController],
})
export class CarbonFootprintModule {}
