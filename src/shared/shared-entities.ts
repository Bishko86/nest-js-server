import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ContentDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 70, nullable: false })
  name: string;

  @Column({ name: 'description', length: 180, nullable: false })
  description: string;
}
