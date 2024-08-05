import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CarbonFootprintEntity } from './infrastructure/orm/carbonFootprintEntity';
import { CarbonFootprintRepositoryImpl } from './infrastructure/repositories/carbonFootprintRepositoryImpl';
import { AddCarbonFootprintEntry } from './application/usecases/addCarbonFootprintEntry';
import { ViewHistoricalData } from './application/usecases/viewHistoricalData';
import { GenerateCarbonFootprintReport } from './application/usecases/generateCarbonFootprintReport';
import { ReportRepositoryImpl } from './infrastructure/repositories/reportRepositoryImpl';
import { CarbonFootprintController } from './interfaces/controllers/carbonFootprintController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [CarbonFootprintEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CarbonFootprintEntity]),
  ],
  controllers: [CarbonFootprintController],
  providers: [
    {
      provide: 'CarbonFootprintRepository',
      useClass: CarbonFootprintRepositoryImpl,
    },
    AddCarbonFootprintEntry,
    ViewHistoricalData,
    {
      provide: 'ReportRepository', // Provide the ReportRepository implementation
      useClass: ReportRepositoryImpl,
    },
    GenerateCarbonFootprintReport, // Ensure this service is listed in the providers
  ],
})
export class AppModule {}
