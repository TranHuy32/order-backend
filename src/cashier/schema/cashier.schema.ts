import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashierDocument = Cashier & Document;

@Schema()
export class Cashier {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  cashierName: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  refreshToken: string;
  @Prop({ default: null })
  createdAt: string;
  @Prop({ default: null })
  updatedAt: string;
}

export const CashierSchema = SchemaFactory.createForClass(Cashier);
