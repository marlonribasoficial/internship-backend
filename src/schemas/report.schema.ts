import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostSchema } from './post/post.schema';
import { User, UserSchema } from './user.schema';

export enum Reason {
    SPAM = 'spam',
    OFFENSIVE = 'offensive',
    FAKE_INFORMATION = 'fake_information',
    HARASSMENT = 'harassment'
    OTHER = 'other'
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: Reason, required: true })
  reason: Reason;

  @Prop({ default: null })
  description: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({ postId: 1, createdAt: -1 });
ReportSchema.index({ userId: 1, createdAt: -1 });