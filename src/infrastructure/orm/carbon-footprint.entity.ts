import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carbon_footprint_entries')
export class CarbonFootprintEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('float')
  value!: number;

  @Column()
  unit!: string;

  @Column('timestamp')
  date!: Date;
}
