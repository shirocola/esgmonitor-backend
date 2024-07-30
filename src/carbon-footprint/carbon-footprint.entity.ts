import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarbonFootprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;
}
