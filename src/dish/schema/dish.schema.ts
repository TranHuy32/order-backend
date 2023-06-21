import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DishDocument = Dish & Document;

@Schema()
export class Dish {
  @Prop({ required: true })
  image_detail_id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ type: [String] })
  categories: string[];
  @Prop({ default: null })
  description: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  isBestSeller: boolean;
  @Prop({ required: true })
  createAt: string;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
