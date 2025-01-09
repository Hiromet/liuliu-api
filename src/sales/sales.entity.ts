import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Clients } from "../clients/clients.entity";
import { SalesProducts } from "./sales-products.entity";

@Entity("sales")
export class Sales {
  @PrimaryGeneratedColumn("uuid")
  order_id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ default: "pending" })
  payment_status: string;

  @Column({ default: "pending" })
  delivery_status: string;

  @ManyToOne(() => Clients, { eager: true })
  @JoinColumn({ name: "client_id" })
  client: Clients;

  @OneToMany(() => SalesProducts, (salesProducts) => salesProducts.sale, {
    eager: true,
    cascade: true,
  })
  salesProducts: SalesProducts[];
}