import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateCarbonFootprintDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}
