export class CreateSaleDto {
  client_id: number;
  products_ids: number[];
  payment_status?: string;
  delivery_status?: string;
}
