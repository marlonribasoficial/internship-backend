import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class PostUser {
  @Prop({ required: true, type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop({ default: null })
  photoUrl: string;

  @Prop({ default: null })
  country: string;
}

export const PostUserSchema = SchemaFactory.createForClass(PostUser);