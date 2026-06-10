import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Schema({ _id: false })
export class Media {
    @Prop({ required: true, enum: MediaType })
    type: MediaType;

    @Prop({ required: true })
    url: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);