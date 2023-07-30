import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ require: true })
  name: string;
  @Prop({ require: true })
  cashier_id: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
