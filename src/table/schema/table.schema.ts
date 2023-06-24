import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TableDocument = Table & Document;

@Schema()
export class Table {
  @Prop({ required: true })
  name: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ required: true })
  createAt: string;
  @Prop({ default: null })
  updateAt: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
