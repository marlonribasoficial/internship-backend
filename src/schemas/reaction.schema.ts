import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum Type {
    LIKE = 'like',
    DISLIKE = 'dislike'
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: Type, required: true })
  type: Type;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.index({ postId: 1, userId: 1 }, { unique: true });