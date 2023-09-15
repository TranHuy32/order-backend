import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DishDocument = Dish & Document;

@Schema()
export class Dish {
  @Prop({ required: true })
  image_detail_id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ default: 0 })
  price: number;
  @Prop({ required: true })
  category: string;
  @Prop({ default: null })
  description: string;
  @Prop({ default: 0 })
  amount: number;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  isBestSeller: boolean;
  @Prop({ required: true })
  createAt: string;
  @Prop({ required: true })
  group_id: string;
  @Prop({ default: null })
  updateAt: string;
  @Prop([{ name: String, price: { type: Number, default: 0 } }])
  options: { name: string; price: number }[];
}

export const DishSchema = SchemaFactory.createForClass(Dish);
