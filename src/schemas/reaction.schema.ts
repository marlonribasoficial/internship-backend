import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostSchema } from './post/post.schema';
import { User, UserSchema } from './user.schema';

export enum Type {
    LIKE = 'like',
    DISLIKE = 'dislike'
}

@Schema({ timestamps: true })
export class Reaction {
    @Prop({ type: UserSchema, required: true })
    user: User;

    @Prop({ type: PostSchema, required: true })
    post: Post;

    @Prop({ type: String, enum: Type, required: true })
    type: Type;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);