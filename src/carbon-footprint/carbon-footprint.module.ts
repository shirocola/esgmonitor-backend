import { Module } from '@nestjs/common';
import { CarbonFootprintService } from './carbon-footprint.service';
import { CarbonFootprintController } from './carbon-footprint.controller';

@Module({
  providers: [CarbonFootprintService],
  controllers: [CarbonFootprintController]
})
export class CarbonFootprintModule {}
