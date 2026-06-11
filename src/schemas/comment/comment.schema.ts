import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post } from '../post/post.schema';
import { CommentUser, CommentUserSchema } from './commentuser.schema';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ type: CommentUserSchema, required: true })
    user: CommentUser;

    @Prop({ required: true })
    message: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ postId: 1, createdAt: 1 });
