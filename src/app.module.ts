import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CarbonFootprintEntity } from './infrastructure/orm/carbonFootprintEntity';
import { CarbonFootprintRepositoryImpl } from './infrastructure/repositories/carbonFootprintRepositoryImpl';
import { CarbonFootprintController } from './interfaces/controllers/carbonFootprintController';
import { AddCarbonFootprintEntry } from './application/usecases/addCarbonFootprintEntry';
import { CarbonFootprintService } from './interfaces/controllers/carbonFootprintService'; // Import your service

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
    CarbonFootprintRepositoryImpl,
    {
      provide: 'CarbonFootprintRepository',
      useClass: CarbonFootprintRepositoryImpl,
    },
    AddCarbonFootprintEntry,
    CarbonFootprintService, // Register your service here
  ],
})
export class AppModule {}
