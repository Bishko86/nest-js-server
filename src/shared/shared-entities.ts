import { Expose } from 'class-transformer';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ContentDB {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ name: 'name', length: 70, nullable: false })
  @Expose()
  name: string;

  @Column({ name: 'description', length: 180, nullable: false })
  @Expose()
  description: string;
}
