import { CreateDishOrderDto } from "./create-dish-order.dto";

export class CartResponse {
    _id: string;
    order: CreateDishOrderDto[];
    note: string;
    total: number;
    createAt: string;
    status: string;
    cashier_id: string;
    table: number;
    constructor(cart: any) {
        this._id = cart._id;
        this.order = cart.order;
        this.note = cart.note;
        this.total = cart.total;
        this.createAt = cart.createAt;
        this.status = cart.status;
        this.cashier_id = cart.cashier_id;
        this.table = cart.table;
    }
}
