import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sales } from './sales.entity';
import { Products } from '../products/products.entity';

@Entity('sales_products')
export class SalesProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sales, (sale) => sale.salesProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sales;

  @ManyToOne(() => Products, (product) => product.salesProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
