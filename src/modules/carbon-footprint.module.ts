// src/modules/carbon-footprint/carbon-footprint.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonFootprintEntity } from '../infrastructure/orm/carbon-footprint.entity';
import { CarbonFootprintRepositoryImpl } from '../infrastructure/repositories/carbon-footprint.repository-impl';
import { ReportRepositoryImpl } from '../infrastructure/repositories/report.repositoryImpl'; // Import ReportRepositoryImpl
import { AddCarbonFootprintEntry } from '../application/usecases/add-carbon-footprint-entry.usecase';
import { ViewHistoricalData } from '../application/usecases/view-historical-data.usecase';
import { GenerateCarbonFootprintReport } from '../application/usecases/generate-carbon-footprint-report.usecase';
import { GetRealTimeCarbonFootprintData } from '../application/usecases/get-realtime-carbon-footprint-data.usecase';
import { CarbonFootprintController } from '../interfaces/controllers/carbon-footprint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonFootprintEntity])],
  controllers: [CarbonFootprintController],
  providers: [
    {
      provide: 'CarbonFootprintRepository',
      useClass: CarbonFootprintRepositoryImpl,
    },
    {
      provide: 'ReportRepository',
      useClass: ReportRepositoryImpl,
    },
    AddCarbonFootprintEntry,
    ViewHistoricalData,
    GenerateCarbonFootprintReport,
    GetRealTimeCarbonFootprintData,
  ],
  exports: ['CarbonFootprintRepository', 'ReportRepository'], // Export if needed in other modules
})
export class CarbonFootprintModule {}
