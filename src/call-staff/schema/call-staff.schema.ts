import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CallStaffDocument = CallStaff & Document;

@Schema()
export class CallStaff {
  @Prop({ required: true })
  table: string;
  @Prop({ required: true })
  createAt: string;
  @Prop({ required: true })
  cashier_id: string;
  @Prop({ default: null })
  customer_name: string;
}

export const CallStaffSchema = SchemaFactory.createForClass(CallStaff);
