export class CreateSaleDto {
  client_id: string;
  products: {
    id: string;
    quantity: number;
  }[];
  payment_status?: string;
  delivery_status?: string;
}
