export class UpdateSaleDto {
  payment_status?: string;
  delivery_status?: string;
  products?: {
    id: string;
    quantity: number;
  }[];
}
