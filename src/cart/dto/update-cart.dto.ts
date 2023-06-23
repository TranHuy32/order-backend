import { CreateDishOrderDto } from './create-dish-order.dto';

export class UpdateCartDto {
  order: CreateDishOrderDto[];
  note: string;
  total: number;
  table: number;
  updateAt: string;
}  