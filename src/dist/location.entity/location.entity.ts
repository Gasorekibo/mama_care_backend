import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { HealthcareFacility } from "../healthcare_facilities.entity/healthcare_facilities.entity";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  address: string;

  @Column()
  region: string;

  @Column()
  province: string;

  @OneToMany(() => HealthcareFacility, (facility) => facility.location)
  healthcareFacilities: HealthcareFacility[];
}
