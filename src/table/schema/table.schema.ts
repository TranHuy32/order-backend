import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TableDocument = Table & Document;

@Schema()
export class Table {
  @Prop({ required: true })
  name: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: null })
  token: string;
  @Prop({ required: true })
  createAt: string;
  @Prop({ default: null })
  updateAt: string;
  @Prop({ required: true })
  group_id: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
