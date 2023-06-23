import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateDishOrderDto } from '../dto/create-dish-order.dto';

export type CartDocument = Cart & Document;

export enum CartStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Schema()
export class Cart {
  @Prop({ required: true })
  order: CreateDishOrderDto[];
  @Prop({ default: null })
  note: string;
  @Prop({ required: true })
  createAt: string;
  @Prop({ enum: Object.values(CartStatus), default: CartStatus.PENDING })
  status: string;
  @Prop({ required: true })
  total: number;
  @Prop({ default: null })
  cashier_id: string;
  @Prop({ required: true })
  table: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
