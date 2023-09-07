import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateDishOrderDto } from '../dto/create-dish-order.dto';

export type CartDocument = Cart & Document;

export enum CartStatus {
  // PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCEL = 'CANCEL',
  COMPLETED = 'COMPLETED',
  WAITPAY = 'WAITPAY',
}
export enum PaymentMethod {
  NULL = 'NULL',
  CASH = 'CASH',
  BANK = 'BANK',
}
@Schema()
export class Cart {
  @Prop({ required: true })
  order: CreateDishOrderDto[];
  @Prop({ default: null })
  note: string;
  @Prop({ required: true })
  createAt: string;
  @Prop({ default: null })
  updateAt: string;
  @Prop({ enum: Object.values(CartStatus), default: CartStatus.WAITPAY })
  status: CartStatus;
  @Prop({ enum: Object.values(PaymentMethod), default: PaymentMethod.NULL })
  paymentMethod: PaymentMethod;
  @Prop({ required: true })
  total: number;
  @Prop({ default: null })
  group_id: string;
  @Prop({ required: true })
  table: string;
  @Prop({ default: null })
  customer_name: string;
  @Prop({ default: null })
  image_payment_id: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
