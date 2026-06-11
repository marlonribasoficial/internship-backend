import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class PostUser {
  @Prop({ required: true, type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop()
  photoUrl?: string;

  @Prop({ required: true })
  country: string;
}

export const PostUserSchema = SchemaFactory.createForClass(PostUser);