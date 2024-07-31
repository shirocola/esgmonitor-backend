// carbonFootprintEntry.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carbon_footprint_entries')
export class CarbonFootprintEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column()
  unit: string;

  @Column()
  date: Date;

  constructor(name: string, value: number, unit: string, date: Date) {
    this.name = name;
    this.value = value;
    this.unit = unit;
    this.date = date;
  }

  validate() {
    if (!this.name || this.value <= 0 || !this.unit || !this.date) {
      throw new Error('Invalid carbon footprint entry');
    }
  }
}
