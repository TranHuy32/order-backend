import { Role } from '../schema/cashier.schema';

export class CreateCashierDto {
  name: string;
  cashierName: string;
  password: string;
  createdAt: string;
  role: Role;
}
