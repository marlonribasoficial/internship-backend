import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostSchema } from './post/post.schema';
import { User, UserSchema } from './user.schema';

export enum Reason {
    SPAM = 'spam',
    OFFENSIVE = 'offensive',
    FAKE_INFORMATION = 'fake_information',
    HARRASMENT = 'harassment',
    OTHER = 'other'
}

@Schema({ timestamps: true })
export class Report {
    @Prop({ type: UserSchema, required: true })
    user: User;

    @Prop({ type: PostSchema, required: true })
    post: Post;

    @Prop({ type: String, enum: Reason, required: true })
    reason: Reason;

    @Prop({ required: true })
    description: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);