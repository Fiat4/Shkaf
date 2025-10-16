export interface IOrder {
  id: string;
  status: "ACTIVE" | 'CANCELED' | 'COMPLETED';
  userName: string;
  email: string;
  tel: string;
  comment?: string | null;
  productId?: string | null;
}

export interface IOrderForm {
  userName: string;
  email: string;
  tel: string;
  productId: string;
}