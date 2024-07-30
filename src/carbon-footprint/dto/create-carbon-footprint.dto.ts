import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarbonFootprintDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
