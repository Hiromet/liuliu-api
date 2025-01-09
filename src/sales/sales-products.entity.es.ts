import { Entity, Column } from 'typeorm';

@Entity('sales_products')
export class ProductsQuantity {
  @Column()
  quantity: number;

}
