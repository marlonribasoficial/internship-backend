import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Coordinates {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true, validate: { validator: (v: number[]) => v.length === 2 } })
  coordinates: [number, number];
}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);