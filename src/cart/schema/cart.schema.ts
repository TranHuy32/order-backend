import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateDishOrderDto } from '../dto/create-dish-order.dto';

export type CartDocument = Cart & Document;

export enum CartStatus {
  // PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCEL = 'CANCEL',
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
  @Prop({ default: null })
  updateAt: string;
  @Prop({ enum: Object.values(CartStatus), default: CartStatus.IN_PROGRESS })
  status: CartStatus;
  @Prop({ required: true })
  total: number;
  @Prop({ default: null })
  group_id: string;
  @Prop({ default: false })
  isPaid: boolean;
  @Prop({ required: true })
  table: string;
  @Prop({ default: null })
  customer_name: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
