import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Clients } from '../clients/clients.entity';
import { Products } from '../products/products.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: 'pending' })
  payment_status: string;

  @Column({ default: 'pending' })
  delivery_status: string;

  @ManyToOne(() => Clients, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @ManyToMany(() => Products, { eager: true })
  @JoinTable({
    name: 'sales_products',
    joinColumn: { name: 'sale_id', referencedColumnName: 'order_id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Products[];
}
