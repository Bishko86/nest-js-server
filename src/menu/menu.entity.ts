import { ContentDB } from 'src/shared/shared-entities';
import { Entity, Column } from 'typeorm';

@Entity('menus')
export class Menu extends ContentDB {
  @Column({ name: 'imageUrl', nullable: false })
  imageUrl: string;

  @Column({ name: 'rating', type: 'float', nullable: true })
  rating: number;
}
