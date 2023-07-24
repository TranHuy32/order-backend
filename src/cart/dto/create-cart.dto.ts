import { CreateDishOrderDto } from './create-dish-order.dto';

export class CreateCartDto {
  order: CreateDishOrderDto[];
  note: string;
  total: number;
  table: string;
  createAt: string;
  customer_name: string
}  