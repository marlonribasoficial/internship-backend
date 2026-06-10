import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class CommentUser {
  @Prop({ required: true, type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop({ default: null })
  photoUrl: string;
}

export const CommentUserSchema = SchemaFactory.createForClass(CommentUser);