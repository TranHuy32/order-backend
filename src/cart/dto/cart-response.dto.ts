import { CreateDishOrderDto } from './create-dish-order.dto';

export class CartResponse {
  _id: string;
  order: CreateDishOrderDto[];
  note: string;
  total: number;
  createAt: string;
  status: string;
  group_id: string;
  table: string;
  customer_name: string;
  isPaid: boolean;
  constructor(cart: any) {
    this._id = cart._id;
    this.order = cart.order;
    this.note = cart.note;
    this.total = cart.total;
    this.createAt = cart.createAt;
    this.status = cart.status;
    this.group_id = cart.group_id;
    this.table = cart.table;
    this.customer_name = cart.customer_name;
    this.isPaid = cart.isPaid;
  }
}
