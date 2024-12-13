import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products_category')
export class ProductsCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
