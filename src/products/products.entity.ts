import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductsCategory } from '../products_category/products_category.entity';
import { SalesProducts } from '../sales/sales-products.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => ProductsCategory, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: ProductsCategory;

  @OneToMany(() => SalesProducts, (salesProducts) => salesProducts.product)
  salesProducts: SalesProducts[];
}
