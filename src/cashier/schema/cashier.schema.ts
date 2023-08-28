import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashierDocument = Cashier & Document;

export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MANAGE = 'MANAGE',
  STAFF = 'STAFF',
}

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
  @Prop({ enum: Object.values(Role), required: true })
  role: Role;
  @Prop({ default: null })
  group_id: string;
  @Prop({ default: null })
  createdAt: string;
  @Prop({ default: null })
  updatedAt: string;
}

export const CashierSchema = SchemaFactory.createForClass(Cashier);
